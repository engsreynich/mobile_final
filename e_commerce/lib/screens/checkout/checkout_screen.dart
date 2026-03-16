import 'package:e_commerce/models/cart.dart';
import 'package:e_commerce/services/apis/cart_api.dart';
import 'package:e_commerce/services/apis/order_api.dart';
import 'package:flutter/material.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final CartApi cartApi = CartApi();
  final addressController = TextEditingController();

  Cart? cart;
  bool loading = true;
  bool placingOrder = false;

  @override
  void initState() {
    super.initState();
    fetchCart();
  }

  Future<void> fetchCart() async {
    try {
      final data = await cartApi.fetchCart();

      setState(() {
        cart = data;
        loading = false;
      });
    } catch (e) {
      setState(() {
        loading = false;
      });
    }
  }

  double getTotal() {
    if (cart == null) return 0;

    double total = 0;

    for (var item in cart!.items) {
      total += item.product.price * item.quantity;
    }

    return total;
  }

  Future<void> placeOrder() async {
    if (cart == null) return;

    setState(() {
      placingOrder = true;
    });

    final items = cart!.items.map((item) {
      return {
        "product": item.product.id,
        "price": item.product.price,
        "quantity": item.quantity,
      };
    }).toList();

    final response = await OrderApi.placeOrder(
      userId: cart!.userId,
      items: items,
      shippingAddress: addressController.text,
      latitude: 11.5564,
      longitude: 104.9282,
    );

    setState(() {
      placingOrder = false;
    });

    if (response["orderId"] != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Order placed successfully")),
      );

      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(response["error"] ?? "Order failed")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (cart == null || cart!.items.isEmpty) {
      return const Scaffold(
        body: Center(child: Text("Cart is empty")),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text("Checkout"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            
            /// Cart Items
            Expanded(
              child: ListView.builder(
                itemCount: cart!.items.length,
                itemBuilder: (context, index) {
                  final item = cart!.items[index];

                  return ListTile(
                    title: Text(item.product.name ?? ""),
                    subtitle: Text("Qty: ${item.quantity}"),
                    trailing: Text(
                      "\$${item.product.price * item.quantity}",
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 10),

            /// Address
            TextField(
              controller: addressController,
              decoration: const InputDecoration(
                labelText: "Shipping Address",
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 20),

            /// Total
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Total:",
                  style: TextStyle(fontSize: 18),
                ),
                Text(
                  "\$${getTotal()}",
                  style: const TextStyle(fontSize: 18),
                ),
              ],
            ),

            const SizedBox(height: 20),

            /// Place Order Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: placingOrder ? null : placeOrder,
                child: placingOrder
                    ? const CircularProgressIndicator()
                    : const Text("Place Order"),
              ),
            )
          ],
        ),
      ),
    );
  }
}