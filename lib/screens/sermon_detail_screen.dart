import 'dart:io';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import '../models/sermon.dart';

class SermonDetailScreen extends StatelessWidget {
  final Sermon sermon;
  const SermonDetailScreen({super.key, required this.sermon});

  @override
  Widget build(BuildContext context) {
    final dateStr = DateFormat('yyyy년 MM월 dd일').format(sermon.date);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text(sermon.title, overflow: TextOverflow.ellipsis),
          bottom: const TabBar(
            tabs: [
              Tab(text: '정리된 설교'),
              Tab(text: '원본 녹취'),
            ],
          ),
        ),
        body: Column(
          children: [
            Expanded(
              child: TabBarView(
                children: [
                  _ContentTab(
                      date: dateStr,
                      title: sermon.title,
                      body: sermon.organizedText),
                  _ContentTab(
                      date: dateStr,
                      title: sermon.title,
                      body: sermon.transcription),
                ],
              ),
            ),
            _FileActions(sermon: sermon),
          ],
        ),
      ),
    );
  }
}

class _ContentTab extends StatelessWidget {
  final String date;
  final String title;
  final String body;

  const _ContentTab({required this.date, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: Theme.of(context)
                  .textTheme
                  .headlineSmall
                  ?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(date, style: TextStyle(color: Colors.grey.shade600)),
          const Divider(height: 28),
          Text(body, style: const TextStyle(fontSize: 15, height: 1.85)),
        ],
      ),
    );
  }
}

class _FileActions extends StatelessWidget {
  final Sermon sermon;
  const _FileActions({required this.sermon});

  Future<void> _share(BuildContext context, String path, String label) async {
    if (!File(path).existsSync()) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('$label 파일을 찾을 수 없습니다: $path')),
        );
      }
      return;
    }
    await Share.shareXFiles([XFile(path)], text: sermon.title);
  }

  @override
  Widget build(BuildContext context) {
    final hasDocx = sermon.docxPath != null;
    final hasPdf = sermon.pdfPath != null;

    if (!hasDocx && !hasPdf) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerLow,
        border: Border(top: BorderSide(color: Colors.grey.shade300)),
      ),
      child: Row(
        children: [
          if (hasDocx)
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _share(context, sermon.docxPath!, 'DOCX'),
                icon: const Icon(Icons.article_outlined),
                label: const Text('📄 DOCX 공유'),
                style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12)),
              ),
            ),
          if (hasDocx && hasPdf) const SizedBox(width: 12),
          if (hasPdf)
            Expanded(
              child: FilledButton.icon(
                onPressed: () => _share(context, sermon.pdfPath!, 'PDF'),
                icon: const Icon(Icons.picture_as_pdf),
                label: const Text('📕 PDF 공유'),
                style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12)),
              ),
            ),
        ],
      ),
    );
  }
}
