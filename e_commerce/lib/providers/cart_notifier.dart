import 'dart:developer';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart.dart';
import '../models/cart_item.dart';
import '../models/product_model.dart';
import '../services/apis/cart_api.dart';

class CartNotifier extends StateNotifier<Cart> {
  final CartApi _cartApi;

  CartNotifier(this._cartApi) : super(Cart(id: '', userId: '', items: []));

  Future<void> fetchCart() async {
    try {
      final cart = await _cartApi.fetchCart();
      state = cart;
    } catch (error) {
      log('Failed to fetch cart: $error');
    }
  }

  Future<void> addProduct(CartItem item) async {
    try {
      log('Adding product to cart: ${item.product.name}');
      await _cartApi.addToCart(item);
      
      await fetchCart();
    } catch (error) {
      log('Failed to add product: $error');
    }
  }

  Future<void> updateQuantity(
      Product product, int quantity, String cartId, String itemId) async {
    final newQuantity = quantity < 1 ? 1 : quantity;
    
    try {
      
      final oldState = state;
      
      state = Cart(
        id: state.id,
        userId: state.userId,
        items: [
          for (final item in state.items)
            if (item.id == itemId)
              CartItem(
                product: item.product, 
                quantity: newQuantity, 
                id: item.id
              )
            else
              item,
        ],
      );

      try {
        await _cartApi.updateQuantity(newQuantity, cartId, itemId);
      } catch (e) {
        state = oldState;
        rethrow;
      }
    } catch (error) {
      log('Failed to update quantity: $error');
    }
  }

  Future<void> removeCartItem(String cartId, String itemId) async {
    try {
      
      final oldState = state;
      
      state = Cart(
        id: state.id,
        userId: state.userId,
        items: state.items.where((item) => item.id != itemId).toList(),
      );

      try {
        await _cartApi.deleteCartItems(cartId, itemId);
      } catch (e) {
        state = oldState;
        rethrow;
      }
    } catch (error) {
      log('Failed to remove item: $error');
    }
  }

  void clearCart() {
    state = Cart(id: '', userId: '', items: []);
  }
}

final cartApiProvider = Provider<CartApi>((ref) {
  return CartApi();
});

final cartStateNotifierProvider =
    StateNotifierProvider<CartNotifier, Cart>((ref) {
  final api = ref.watch(cartApiProvider);
  return CartNotifier(api);
});