import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';
import '../services/api_service.dart';
import '../providers/sermon_provider.dart';
import '../models/sermon.dart';

enum _Stage { idle, recording, stt, transcribed, ai, organized, saving, done }

class RecordScreen extends StatefulWidget {
  const RecordScreen({super.key});

  @override
  State<RecordScreen> createState() => _RecordScreenState();
}

class _RecordScreenState extends State<RecordScreen> {
  final _recorder = AudioRecorder();
  final _titleCtrl = TextEditingController();

  _Stage _stage = _Stage.idle;
  String? _audioPath;
  String? _transcription;
  String? _organizedText;
  String? _error;
  Duration _elapsed = Duration.zero;
  Timer? _timer;

  @override
  void dispose() {
    _recorder.dispose();
    _titleCtrl.dispose();
    _timer?.cancel();
    super.dispose();
  }

  // ── Recording ────────────────────────────────────────────────────────────

  Future<void> _startRecording() async {
    final hasPermission = await _recorder.hasPermission();
    if (!hasPermission) {
      _setError('마이크 권한이 필요합니다.\n앱 설정에서 마이크 권한을 허용해 주세요.');
      return;
    }

    final dir = await getTemporaryDirectory();
    final path =
        '${dir.path}/sermon_${DateTime.now().millisecondsSinceEpoch}.m4a';

    await _recorder.start(
      const RecordConfig(encoder: AudioEncoder.aacLc, numChannels: 1),
      path: path,
    );

    setState(() {
      _stage = _Stage.recording;
      _elapsed = Duration.zero;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() => _elapsed += const Duration(seconds: 1));
    });
  }

  Future<void> _stopRecording() async {
    _timer?.cancel();
    _audioPath = await _recorder.stop();
    if (_audioPath == null) {
      _setError('녹음 파일을 찾을 수 없습니다.');
      return;
    }
    setState(() => _stage = _Stage.stt);
    await _runSTT();
  }

  // ── STT ──────────────────────────────────────────────────────────────────

  Future<void> _runSTT() async {
    try {
      final text = await ApiService.transcribeAudio(_audioPath!);
      setState(() {
        _transcription = text;
        _stage = _Stage.transcribed;
      });
    } catch (e) {
      _setError('음성 변환 오류:\n$e');
    }
  }

  // ── AI organize ──────────────────────────────────────────────────────────

  Future<void> _runAI() async {
    final title = _titleCtrl.text.trim();
    if (title.isEmpty) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('설교 제목을 입력해 주세요')));
      return;
    }
    setState(() => _stage = _Stage.ai);
    try {
      final text = await ApiService.organizeSermon(title, _transcription!);
      setState(() {
        _organizedText = text;
        _stage = _Stage.organized;
      });
    } catch (e) {
      setState(() => _stage = _Stage.transcribed);
      _setError('AI 정리 오류:\n$e');
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────

  Future<void> _save() async {
    setState(() => _stage = _Stage.saving);
    try {
      final now = DateTime.now();
      final paths = await ApiService.saveSermon(
        title: _titleCtrl.text.trim(),
        date: now.toIso8601String(),
        transcription: _transcription!,
        organizedText: _organizedText!,
      );
      final sermon = Sermon(
        id: const Uuid().v4(),
        title: _titleCtrl.text.trim(),
        date: now,
        transcription: _transcription!,
        organizedText: _organizedText!,
        docxPath: paths['docxPath'],
        pdfPath: paths['pdfPath'],
      );
      if (mounted) {
        await context.read<SermonProvider>().addSermon(sermon);
        setState(() => _stage = _Stage.done);
      }
    } catch (e) {
      setState(() => _stage = _Stage.organized);
      _setError('저장 오류:\n$e');
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  void _setError(String msg) {
    setState(() {
      _error = msg;
      _stage = _Stage.idle;
    });
  }

  String _fmt(Duration d) {
    final m = d.inMinutes.toString().padLeft(2, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  // ── UI ───────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('새 설교 녹음'),
        leading: BackButton(
          onPressed: () {
            if (_stage == _Stage.recording) {
              _recorder.stop();
              _timer?.cancel();
            }
            Navigator.pop(context);
          },
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: _body(),
        ),
      ),
    );
  }

  Widget _body() {
    if (_error != null) {
      return _ErrorView(
        message: _error!,
        onRetry: () => setState(() {
          _error = null;
          _stage = _Stage.idle;
        }),
      );
    }
    return switch (_stage) {
      _Stage.idle => _IdleView(onStart: _startRecording),
      _Stage.recording => _RecordingView(elapsed: _elapsed, onStop: _stopRecording),
      _Stage.stt => const _LoadingView('🎤 음성을 텍스트로 변환 중...'),
      _Stage.transcribed => _TranscribedView(
          transcription: _transcription!,
          titleCtrl: _titleCtrl,
          onOrganize: _runAI,
        ),
      _Stage.ai => const _LoadingView('🤖 AI가 설교를 정리 중...'),
      _Stage.organized => _OrganizedView(
          organizedText: _organizedText!,
          onBack: () => setState(() => _stage = _Stage.transcribed),
          onSave: _save,
        ),
      _Stage.saving => const _LoadingView('💾 DOCX/PDF 파일 생성 중...'),
      _Stage.done => _DoneView(onHome: () => Navigator.pop(context)),
    };
  }
}

// ── Sub-widgets ──────────────────────────────────────────────────────────────

class _IdleView extends StatelessWidget {
  final VoidCallback onStart;
  const _IdleView({required this.onStart});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 80),
        Icon(Icons.mic_none, size: 100, color: Colors.grey.shade400),
        const SizedBox(height: 24),
        Text('버튼을 눌러 녹음을 시작하세요',
            style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 60),
        FilledButton.icon(
          onPressed: onStart,
          icon: const Icon(Icons.mic, size: 26),
          label: const Text('🎙 녹음 시작', style: TextStyle(fontSize: 17)),
          style: FilledButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
            shape: const StadiumBorder(),
          ),
        ),
      ],
    );
  }
}

class _RecordingView extends StatelessWidget {
  final Duration elapsed;
  final VoidCallback onStop;
  const _RecordingView({required this.elapsed, required this.onStop});

  String get _fmt {
    final m = elapsed.inMinutes.toString().padLeft(2, '0');
    final s = (elapsed.inSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 80),
        const Icon(Icons.mic, size: 100, color: Colors.red),
        const SizedBox(height: 16),
        Text(_fmt,
            style: const TextStyle(fontSize: 52, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('녹음 중...', style: TextStyle(color: Colors.red, fontSize: 16)),
        const SizedBox(height: 60),
        FilledButton.icon(
          onPressed: onStop,
          icon: const Icon(Icons.stop, size: 26),
          label: const Text('⏹ 녹음 종료', style: TextStyle(fontSize: 17)),
          style: FilledButton.styleFrom(
            backgroundColor: Colors.red,
            padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
            shape: const StadiumBorder(),
          ),
        ),
      ],
    );
  }
}

class _LoadingView extends StatelessWidget {
  final String message;
  const _LoadingView(this.message);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 100),
        const CircularProgressIndicator(),
        const SizedBox(height: 28),
        Text(message,
            style: const TextStyle(fontSize: 16), textAlign: TextAlign.center),
      ],
    );
  }
}

class _TranscribedView extends StatelessWidget {
  final String transcription;
  final TextEditingController titleCtrl;
  final VoidCallback onOrganize;

  const _TranscribedView({
    required this.transcription,
    required this.titleCtrl,
    required this.onOrganize,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('🎤 음성 변환 결과',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Text(transcription,
              style: const TextStyle(fontSize: 14, height: 1.7)),
        ),
        const SizedBox(height: 24),
        const Text('설교 제목',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        TextField(
          controller: titleCtrl,
          decoration: const InputDecoration(
            hintText: '예: 요한복음 3:16 – 하나님의 사랑',
            border: OutlineInputBorder(),
          ),
          textInputAction: TextInputAction.done,
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: onOrganize,
            icon: const Icon(Icons.auto_awesome),
            label: const Text('🤖 AI로 설교 정리', style: TextStyle(fontSize: 16)),
            style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14)),
          ),
        ),
      ],
    );
  }
}

class _OrganizedView extends StatelessWidget {
  final String organizedText;
  final VoidCallback onBack;
  final VoidCallback onSave;

  const _OrganizedView({
    required this.organizedText,
    required this.onBack,
    required this.onSave,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('🤖 AI 정리 결과',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.blue.shade50,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.blue.shade200),
          ),
          child: Text(organizedText,
              style: const TextStyle(fontSize: 14, height: 1.7)),
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onBack,
                icon: const Icon(Icons.refresh),
                label: const Text('다시 정리'),
                style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton.icon(
                onPressed: onSave,
                icon: const Icon(Icons.save),
                label: const Text('💾 저장하기'),
                style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _DoneView extends StatelessWidget {
  final VoidCallback onHome;
  const _DoneView({required this.onHome});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 80),
        const Icon(Icons.check_circle, size: 100, color: Colors.green),
        const SizedBox(height: 20),
        const Text('저장 완료!',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text('설교 목록에서 DOCX/PDF를 확인하세요',
            style: TextStyle(color: Colors.grey.shade600)),
        const SizedBox(height: 60),
        FilledButton.icon(
          onPressed: onHome,
          icon: const Icon(Icons.home),
          label: const Text('홈으로', style: TextStyle(fontSize: 16)),
          style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 14)),
        ),
      ],
    );
  }
}

class _ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const _ErrorView({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 80),
        const Icon(Icons.error_outline, size: 72, color: Colors.red),
        const SizedBox(height: 16),
        Text(message,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.red, fontSize: 15)),
        const SizedBox(height: 32),
        ElevatedButton(onPressed: onRetry, child: const Text('다시 시도')),
      ],
    );
  }
}
