import 'dart:convert';
import 'dart:developer';

import 'package:e_commerce/core/constant.dart';
import 'package:e_commerce/models/user_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import '../locals/auth_storage.dart';

final userApiProvider = Provider((ref) => UserApi());

class UserApi {
  Future<String?> _getToken() async {
    return await AuthStorage.getToken();
  }

  Future<User?> fetchUser() async {
    try {
      final token = await _getToken();

      if (token == null) {
        log("No token available");
        return null;
      }

      final url = Uri.parse("${ConstantApp.baseUrl}/api/users/profile");

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body) as Map<String, dynamic>;
        return User.fromJson(jsonResponse);
      } else if (response.statusCode == 404) {
        log("User not found");
        return null;
      } else {
        log("Failed to load user: ${response.reasonPhrase ?? 'Unknown error'}");
        return null;
      }
    } catch (e) {
      log('Error fetching user: $e');
      return null;
    }
  }
}
