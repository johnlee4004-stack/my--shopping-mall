import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/sermon_provider.dart';
import '../widgets/sermon_card.dart';
import 'sermon_detail_screen.dart';

class SermonListScreen extends StatelessWidget {
  const SermonListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SermonProvider>();
    final list = provider.filteredSermons;

    return Scaffold(
      appBar: AppBar(title: const Text('📚 설교 목록')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 4),
            child: TextField(
              onChanged: provider.setSearchQuery,
              decoration: InputDecoration(
                hintText: '🔍 제목 또는 날짜 검색...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.grey.shade100,
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                suffixIcon: provider.searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () => provider.setSearchQuery(''),
                      )
                    : null,
              ),
            ),
          ),
          Expanded(
            child: list.isEmpty
                ? _EmptyState(hasQuery: provider.searchQuery.isNotEmpty)
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    itemCount: list.length,
                    itemBuilder: (ctx, i) {
                      final sermon = list[i];
                      return SermonCard(
                        sermon: sermon,
                        onTap: () => Navigator.push(
                          ctx,
                          MaterialPageRoute(
                            builder: (_) => SermonDetailScreen(sermon: sermon),
                          ),
                        ),
                        onDelete: () => _confirmDelete(ctx, provider, sermon.id, sermon.title),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmDelete(
    BuildContext context,
    SermonProvider provider,
    String id,
    String title,
  ) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('삭제 확인'),
        content: Text('"$title"\n을(를) 삭제하시겠습니까?\n(DOCX/PDF 파일은 기기에 남습니다)'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(c, false),
              child: const Text('취소')),
          TextButton(
              onPressed: () => Navigator.pop(c, true),
              child: const Text('삭제', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (ok == true && context.mounted) {
      provider.deleteSermon(id);
    }
  }
}

class _EmptyState extends StatelessWidget {
  final bool hasQuery;
  const _EmptyState({required this.hasQuery});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inbox_outlined, size: 72, color: Colors.grey.shade400),
          const SizedBox(height: 16),
          Text(
            hasQuery ? '검색 결과가 없습니다' : '저장된 설교가 없습니다',
            style: TextStyle(color: Colors.grey.shade600, fontSize: 16),
          ),
        ],
      ),
    );
  }
}
