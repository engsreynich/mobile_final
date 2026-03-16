import 'package:e_commerce/screens/auth_screen/is_auth.dart';
import 'package:e_commerce/screens/introduction_screen/on_boarding_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'services/locals/onboarding_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final bool onboardingComplete =
      await OnBoardServiceSharedPrefs.hasCompletedOnboarding();

  runApp(
    ProviderScope(
      child: MyApp(onboardingComplete: onboardingComplete),
    ),
  );
}

class MyApp extends StatelessWidget {
  final bool onboardingComplete;

  const MyApp({
    super.key,
    required this.onboardingComplete,
  });

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShopEase',
      debugShowCheckedModeBanner: false,
      home: onboardingComplete ? IsAuth() : const OnBoardingPage(),
    );
  }
}