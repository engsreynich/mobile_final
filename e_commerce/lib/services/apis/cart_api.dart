import 'dart:convert';
import 'package:e_commerce/core/constant.dart';
import 'package:http/http.dart' as http;
import '../../models/cart.dart';
import '../../models/cart_item.dart';
import 'auth_api.dart';

class CartApi {
  final String baseUrl = ConstantApp.baseUrl;
  final AuthApi _authApi = AuthApi();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _authApi.getToken();
    
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  Future<Cart> fetchCart() async {
    try {
      final headers = await _getHeaders();
      final url = '$baseUrl/api/carts';
      
      final response = await http.get(
        Uri.parse(url),
        headers: headers,
      );

    

      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = json.decode(response.body);
        return Cart.fromJson(jsonResponse);
      } else if (response.statusCode == 404) {
        return Cart(id: '', userId: '', items: []);
      } else {
        throw Exception('Failed to fetch cart: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching cart: $e');
    }
  }

  Future<void> addToCart(CartItem item) async {
    try {
      final headers = await _getHeaders();
      final url = '$baseUrl/api/carts';
    
      
      final response = await http.post(
        Uri.parse(url),
        headers: headers,
        body: json.encode({
          'items': [
            {
              'product': item.product.id,
              'quantity': item.quantity,
            }
          ]
        }),
      );

    
      if (response.statusCode == 201 || response.statusCode == 200) {
        return;
      } else {
        throw Exception('Failed to add to cart: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Error adding to cart: $e');
    }
  }

  Future<void> updateQuantity(int quantity, String cartId, String itemId) async {
    try {
      final headers = await _getHeaders();
      final url = '$baseUrl/api/carts/items/$itemId'; 
  
      
      final response = await http.patch(
        Uri.parse(url),
        headers: headers,
        body: json.encode({
          'quantity': quantity,
        }),
      );
      if (response.statusCode == 200) {
        return;
      } else {
        throw Exception('Failed to update quantity: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error updating quantity: $e');
    }
  }

  Future<void> deleteCartItems(String cartId, String itemId) async {
    try {
      final headers = await _getHeaders();
      final url = '$baseUrl/api/carts/items/$itemId'; 
      
      
      final response = await http.delete(
        Uri.parse(url),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return;
      } else {
        throw Exception('Failed to delete item: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error deleting item: $e');
    }
  }

  Future<void> clearCart() async {
    try {
      final headers = await _getHeaders();
      final url = '$baseUrl/api/carts'; 
      
      
      final response = await http.delete(
        Uri.parse(url),
        headers: headers,
      );


      if (response.statusCode == 200) {
        return;
      } else {
        throw Exception('Failed to clear cart: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error clearing cart: $e');
    }
  }
}