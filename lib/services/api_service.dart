import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const _defaultUrl = 'http://10.0.2.2:8000';

  static Future<String> get _base async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('server_url') ?? _defaultUrl;
  }

  static Future<String> transcribeAudio(String audioPath) async {
    final base = await _base;
    final req = http.MultipartRequest('POST', Uri.parse('$base/transcribe'));
    req.files.add(await http.MultipartFile.fromPath('audio', audioPath));
    final res = await req.send().timeout(const Duration(minutes: 5));
    final body = await res.stream.bytesToString();
    if (res.statusCode == 200) {
      return (jsonDecode(body) as Map<String, dynamic>)['transcription'] as String;
    }
    throw Exception('STT 변환 실패 (${res.statusCode}): $body');
  }

  static Future<String> organizeSermon(String title, String transcription) async {
    final base = await _base;
    final res = await http
        .post(
          Uri.parse('$base/organize'),
          headers: {'Content-Type': 'application/json; charset=utf-8'},
          body: jsonEncode({'title': title, 'transcription': transcription}),
        )
        .timeout(const Duration(minutes: 3));
    if (res.statusCode == 200) {
      return (jsonDecode(utf8.decode(res.bodyBytes)) as Map<String, dynamic>)['organized_text']
          as String;
    }
    throw Exception('AI 정리 실패 (${res.statusCode}): ${res.body}');
  }

  static Future<Map<String, String>> saveSermon({
    required String title,
    required String date,
    required String transcription,
    required String organizedText,
  }) async {
    final base = await _base;
    final res = await http
        .post(
          Uri.parse('$base/save'),
          headers: {'Content-Type': 'application/json; charset=utf-8'},
          body: jsonEncode({
            'title': title,
            'date': date,
            'transcription': transcription,
            'organized_text': organizedText,
          }),
        )
        .timeout(const Duration(minutes: 2));

    if (res.statusCode != 200) {
      throw Exception('저장 실패 (${res.statusCode}): ${res.body}');
    }

    final data = jsonDecode(utf8.decode(res.bodyBytes)) as Map<String, dynamic>;
    final docxFile = data['docx_file'] as String;
    final pdfFile = data['pdf_file'] as String;

    final docxPath = await _download('$base/download/$docxFile', docxFile);
    final pdfPath = await _download('$base/download/$pdfFile', pdfFile);

    return {'docxPath': docxPath, 'pdfPath': pdfPath};
  }

  static Future<String> _download(String url, String filename) async {
    final res = await http.get(Uri.parse(url)).timeout(const Duration(minutes: 2));
    if (res.statusCode != 200) {
      throw Exception('다운로드 실패: $filename');
    }
    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(res.bodyBytes);
    return file.path;
  }
}
