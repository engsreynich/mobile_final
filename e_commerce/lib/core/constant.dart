import 'dart:io';

class ConstantApp {
  static String baseUrl = Platform.isIOS ? 'http://localhost:4000': 'http://10.0.2.2:4000';
}