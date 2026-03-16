class CategoryModel {
  final String? id;
  final String? name;
  final String? description;
  final String? parentCategory;
  final bool? isActive;
  final String? createdBy;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final int? totalProducts;

  CategoryModel({
    this.id,
    this.name,
    this.description,
    this.parentCategory,
    this.isActive,
    this.createdBy,
    this.createdAt,
    this.updatedAt,
    this.totalProducts,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['_id'] as String?,
      name: json['name'] as String?,
      description: json['description'] as String?,
      parentCategory: (json['parentCategory'] ?? json['parenCategory']) as String?,
      isActive: json['isActive'] as bool?,
      createdBy: json['createdBy'] as String?,
      createdAt: json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt'] as String) 
          : null,
      updatedAt: json['updatedAt'] != null 
          ? DateTime.tryParse(json['updatedAt'] as String) 
          : null,
      totalProducts: json['totalProducts'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) '_id': id,
      if (name != null) 'name': name,
      if (description != null) 'description': description,
      if (parentCategory != null) 'parentCategory': parentCategory,
      if (isActive != null) 'isActive': isActive,
      if (createdBy != null) 'createdBy': createdBy,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updatedAt': updatedAt!.toIso8601String(),
      if (totalProducts != null) 'totalProducts': totalProducts,
    };
  }
}
class CategoryResponseModel {
  final bool success;
  final int count;
  final List<CategoryModel> data;

  CategoryResponseModel({
    required this.success,
    required this.count,
    required this.data,
  });

  factory CategoryResponseModel.fromJson(Map<String, dynamic> json) {
    return CategoryResponseModel(
      success: json['success'] ?? false,
      count: json['count'] ?? 0,
      data: (json['data'] as List<dynamic>? ?? [])
          .map((item) => CategoryModel.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'count': count,
      'data': data.map((category) => category.toJson()).toList(),
    };
  }
}