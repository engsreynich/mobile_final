 import 'dart:convert';
import 'package:e_commerce/core/constant.dart';
import 'package:e_commerce/services/apis/auth_api.dart';
import 'package:http/http.dart' as http;

class OrderApi {
  static  String baseUrl = ConstantApp.baseUrl;

  static Future placeOrder({
    required String userId,
    required List items,
    required String shippingAddress,
    required double latitude,
    required double longitude,
    required String paymentMethod,
    String? notes
  }) async {
     final token = await AuthApi().getToken();
    final response = await http.post(
      Uri.parse("$baseUrl/api/orders/place-order"),
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        "userId": userId,
        "items": items,
        "shippingAddress": shippingAddress,
        "latitude": latitude,
        "longitude": longitude,
        "paymentMethod": paymentMethod,
        "notes": notes,
      }),
    );

    return jsonDecode(response.body);
  }
}