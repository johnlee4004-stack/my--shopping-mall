import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/sermon.dart';

class SermonCard extends StatelessWidget {
  final Sermon sermon;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const SermonCard({
    super.key,
    required this.sermon,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final dateStr = DateFormat('yyyy.MM.dd').format(sermon.date);
    final hasDocx = sermon.docxPath != null;
    final hasPdf = sermon.pdfPath != null;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: cs.primaryContainer,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.menu_book, color: cs.primary, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(sermon.title,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 15),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 3),
                    Text(dateStr,
                        style: TextStyle(
                            color: Colors.grey.shade600, fontSize: 12)),
                    if (hasDocx || hasPdf) ...[
                      const SizedBox(height: 5),
                      Wrap(
                        spacing: 4,
                        children: [
                          if (hasDocx)
                            _Tag(label: 'DOCX', color: cs.primary),
                          if (hasPdf)
                            _Tag(label: 'PDF', color: Colors.red.shade700),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                tooltip: '삭제',
                onPressed: onDelete,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  final String label;
  final Color color;
  const _Tag({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(label,
          style: TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.w600)),
    );
  }
}
