 import 'dart:convert';
import 'package:e_commerce/core/constant.dart';
import 'package:http/http.dart' as http;

class OrderApi {
  static  String baseUrl = ConstantApp.baseUrl;

  static Future placeOrder({
    required String userId,
    required List items,
    required String shippingAddress,
    required double latitude,
    required double longitude,
  }) async {
    final response = await http.post(
      Uri.parse("$baseUrl/place-order"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "userId": userId,
        "items": items,
        "shippingAddress": shippingAddress,
        "latitude": latitude,
        "longitude": longitude
      }),
    );

    return jsonDecode(response.body);
  }
}