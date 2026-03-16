import 'package:e_commerce/screens/auth/is_auth.dart';
import 'package:e_commerce/screens/introduction/on_boarding_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'services/locals/onboarding_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool onboardingComplete = false;

  @override
  void initState() {
    super.initState();
    _checkOnboardingStatus();
  }

  Future<void> _checkOnboardingStatus() async {
    onboardingComplete =
        await OnBoardServiceSharedPrefs.hasCompletedOnboarding();
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-Commerce',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
 home: onboardingComplete ? OnBoardingPage() : IsAuth(),

    );
  }
}
