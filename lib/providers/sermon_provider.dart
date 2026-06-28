import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/sermon.dart';

class SermonProvider extends ChangeNotifier {
  List<Sermon> _sermons = [];
  String _searchQuery = '';

  List<Sermon> get sermons => _sermons;

  List<Sermon> get filteredSermons {
    if (_searchQuery.isEmpty) return _sermons;
    final q = _searchQuery.toLowerCase();
    return _sermons
        .where((s) =>
            s.title.toLowerCase().contains(q) ||
            s.date.toString().contains(q))
        .toList();
  }

  String get searchQuery => _searchQuery;

  SermonProvider() {
    _load();
  }

  void setSearchQuery(String q) {
    _searchQuery = q;
    notifyListeners();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getStringList('sermons') ?? [];
    _sermons = data
        .map((s) => Sermon.fromJson(jsonDecode(s) as Map<String, dynamic>))
        .toList()
      ..sort((a, b) => b.date.compareTo(a.date));
    notifyListeners();
  }

  Future<void> addSermon(Sermon sermon) async {
    _sermons.insert(0, sermon);
    await _persist();
    notifyListeners();
  }

  Future<void> deleteSermon(String id) async {
    _sermons.removeWhere((s) => s.id == id);
    await _persist();
    notifyListeners();
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(
        'sermons', _sermons.map((s) => jsonEncode(s.toJson())).toList());
  }
}
