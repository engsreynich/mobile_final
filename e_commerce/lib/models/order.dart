class Order {
  final String id;
  final String user;
  final List<OrderItem> items;
  final double totalAmount;
  final String shippingAddress;
  final String status;

  Order({
    required this.id,
    required this.user,
    required this.items,
    required this.totalAmount,
    required this.shippingAddress,
    required this.status,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['_id'],
      user: json['user'],
      items: (json['items'] as List)
          .map((e) => OrderItem.fromJson(e))
          .toList(),
      totalAmount: (json['totalAmount']).toDouble(),
      shippingAddress: json['shippingAddress'],
      status: json['status'],
    );
  }
}

class OrderItem {
  final String product;
  final int quantity;
  final double price;

  OrderItem({
    required this.product,
    required this.quantity,
    required this.price,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      product: json['product'],
      quantity: json['quantity'],
      price: (json['price']).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "product": product,
      "quantity": quantity,
    };
  }
}