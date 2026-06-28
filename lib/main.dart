import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/sermon_provider.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const SermonApp());
}

class SermonApp extends StatelessWidget {
  const SermonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => SermonProvider(),
      child: MaterialApp(
        title: '설교 노트',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF6B4226),
            brightness: Brightness.light,
          ),
          useMaterial3: true,
        ),
        home: const HomeScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
