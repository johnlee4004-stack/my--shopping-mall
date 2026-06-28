class Sermon {
  final String id;
  final String title;
  final DateTime date;
  final String transcription;
  final String organizedText;
  final String? docxPath;
  final String? pdfPath;

  const Sermon({
    required this.id,
    required this.title,
    required this.date,
    required this.transcription,
    required this.organizedText,
    this.docxPath,
    this.pdfPath,
  });

  String get filename {
    final d = date;
    final dateStr =
        '${d.year}${d.month.toString().padLeft(2, '0')}${d.day.toString().padLeft(2, '0')}';
    return '${dateStr}_$title';
  }

  factory Sermon.fromJson(Map<String, dynamic> json) {
    return Sermon(
      id: json['id'] as String,
      title: json['title'] as String,
      date: DateTime.parse(json['date'] as String),
      transcription: json['transcription'] as String,
      organizedText: json['organizedText'] as String,
      docxPath: json['docxPath'] as String?,
      pdfPath: json['pdfPath'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'date': date.toIso8601String(),
        'transcription': transcription,
        'organizedText': organizedText,
        'docxPath': docxPath,
        'pdfPath': pdfPath,
      };

  Sermon copyWith({
    String? id,
    String? title,
    DateTime? date,
    String? transcription,
    String? organizedText,
    String? docxPath,
    String? pdfPath,
  }) {
    return Sermon(
      id: id ?? this.id,
      title: title ?? this.title,
      date: date ?? this.date,
      transcription: transcription ?? this.transcription,
      organizedText: organizedText ?? this.organizedText,
      docxPath: docxPath ?? this.docxPath,
      pdfPath: pdfPath ?? this.pdfPath,
    );
  }
}
