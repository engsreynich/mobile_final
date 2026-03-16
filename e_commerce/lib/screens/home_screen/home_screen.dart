import '../../providers/cart_notifier.dart';
import '../../providers/category_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:badges/badges.dart' as badges;
import 'package:scroll_to_index/scroll_to_index.dart';
import '../../providers/product_notifier.dart';
import '../../services/locals/auth_storage.dart';
import '../../widgets/product_card.dart';
import '../auth_screen/is_auth.dart';
import '../cart_screen/my_cart_screen.dart';
import '../product_detail.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final selectedCategoryProvider = StateProvider<int>((ref) => 0);
  final List<PageStorageKey> _scrollKeys = [];
  final AutoScrollController _scrollController = AutoScrollController();
  final Map<int, GlobalKey> _itemKeys = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      fetchData();
    });
  }

  Future<void> fetchData() async {
    await Future.wait([
      _fetchProducts(),
      _fetchCart(),
      _fetchCategories(),
    ]);
  }

  Future<void> _fetchCart() async {
    await ref.read(cartStateNotifierProvider.notifier).fetchCart();
  }

  Future<void> _fetchProducts() async {
    await ref.read(productStateNotifierProvider.notifier).fetchProducts();
  }

  Future<void> _fetchCategories() async {
    await ref.read(categoryNotifierProvider.notifier).fetchCategories();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final totalCart = ref.watch(cartStateNotifierProvider).items.length;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.white,
        title: const Padding(
          padding: EdgeInsets.only(right: 20),
          child: Text("Discover"),
        ),
        actions: [
          IconButton(
            onPressed: () async {
              await AuthStorage.clearToken();
              if (!context.mounted) return;
              Navigator.pushReplacement(
                  context, MaterialPageRoute(builder: (ctx) => IsAuth()));
            },
            icon: const Icon(Icons.logout),
          ),
          GestureDetector(
            onTap: () {
              Navigator.push(
                  context, MaterialPageRoute(builder: (ctx) => MyCartScreen()));
            },
            child: Padding(
              padding: const EdgeInsets.only(right: 20, left: 20),
              child: badges.Badge(
                badgeStyle: const badges.BadgeStyle(
                  shape: badges.BadgeShape.circle,
                  badgeColor: Colors.green,
                  padding: EdgeInsets.all(5),
                  elevation: 0,
                ),
                badgeContent: Text(
                  totalCart.toString(),
                  style: const TextStyle(color: Colors.white),
                ),
                position: badges.BadgePosition.topEnd(top: -10, end: -5),
                showBadge: totalCart == 0 ? false : true,
                ignorePointer: false,
                child: Container(
                  width: 35,
                  height: 35,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey.shade700),
                    borderRadius: BorderRadius.circular(50),
                  ),
                  child: const Icon(Icons.shopping_basket),
                ),
              ),
            ),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.only(right: 20, left: 20),
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: _buildSearch(),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 25),
            ),

            SliverToBoxAdapter(
              child: _buildBanner(),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 25),
            ),

            SliverToBoxAdapter(
              child: _buildheaderCatories(),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 15),
            ),

            SliverToBoxAdapter(
              child: _buildCategoriesItems(),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 20),
            ),

            _buildProductCarts(),
          ],
        ),
      ),
    );
  }

  void _scrollToCategory(int index) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final screenWidth = MediaQuery.of(context).size.width;
      final keyContext = _itemKeys[index]?.currentContext;

      if (keyContext != null) {
        final RenderBox box = keyContext.findRenderObject() as RenderBox;
        final itemPosition = box.localToGlobal(Offset.zero).dx;
        final itemWidth = box.size.width;
        final targetOffset = _scrollController.offset +
            itemPosition -
            (screenWidth / 2) +
            (itemWidth / 2);
        final minScrollExtent = _scrollController.position.minScrollExtent;
        final maxScrollExtent = _scrollController.position.maxScrollExtent;
        final boundedOffset =
            targetOffset.clamp(minScrollExtent, maxScrollExtent);
        _scrollController.animateTo(
          boundedOffset,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  Widget _buildProductCarts() {
    final productState = ref.watch(productStateNotifierProvider);
    final selectedCategoryIndex = ref.watch(selectedCategoryProvider);
    final categories = ref.watch(categoryNotifierProvider).categories;

    if (categories.isEmpty) {
      return const SliverFillRemaining(
        child: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    while (_scrollKeys.length <= selectedCategoryIndex) {
      _scrollKeys.add(PageStorageKey(selectedCategoryIndex));
    }

    if (productState.isLoading) {
      return const SliverFillRemaining(
        child: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (productState.products.isEmpty) {
      return SliverFillRemaining(
        child: Center(
          child: Text(
            "No products found for this category",
            style: TextStyle(fontSize: 18, color: Colors.grey.shade600),
            textAlign: TextAlign.center,
          ),
        ),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.only(bottom: 20),
      sliver: SliverGrid(
        key: _scrollKeys[selectedCategoryIndex],
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
        ),
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            final product = productState.products[index];
            return GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (ctx) => ProductDetail(product: product),
                  ),
                );
              },
              child: ProductCart(product: product),
            );
          },
          childCount: productState.products.length,
        ),
      ),
    );
  }

  Widget _buildCategoriesItems() {
    final categoryState = ref.watch(categoryNotifierProvider);
    final selectedCategoryIndex = ref.watch(selectedCategoryProvider);

    return categoryState.isLoading
        ? const Center(child: CircularProgressIndicator())
        : SizedBox(
            height: 40,
            child: ListView.builder(
              padding: EdgeInsets.zero,
              scrollDirection: Axis.horizontal,
              itemCount: categoryState.categories.length,
              controller: _scrollController,
              itemBuilder: (context, index) {
                if (!_itemKeys.containsKey(index)) {
                  _itemKeys[index] = GlobalKey();
                }
                final category = categoryState.categories[index];
                return GestureDetector(
                  onTap: () {
                    ref.read(selectedCategoryProvider.notifier).state = index;
                    _scrollToCategory(index);
                    if (category.id == 'all') {
                      ref
                          .read(productStateNotifierProvider.notifier)
                          .fetchProducts();
                    } else {
                      ref
                          .read(productStateNotifierProvider.notifier)
                          .fetchProductsByCategory(category.id ?? '');
                    }
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(left: 10),
                    child: Container(
                      key: _itemKeys[index],
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        border: index != selectedCategoryIndex
                            ? Border.all(color: Colors.black)
                            : null,
                        borderRadius: BorderRadius.circular(10),
                        color: index == selectedCategoryIndex
                            ? const Color(0xff19C463)
                            : Colors.transparent,
                      ),
                      child: Text(
                        category.name!,
                        style: TextStyle(
                          color: index == selectedCategoryIndex
                              ? Colors.white
                              : Colors.black,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          );
  }

  Widget _buildheaderCatories() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          "Categories",
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        Text(
          "See all",
          style: TextStyle(
            fontSize: 16,
            color: Colors.green.shade600,
            fontWeight: FontWeight.w500,
          ),
        )
      ],
    );
  }

  Widget _buildBanner() {
    return Container(
      width: double.infinity,
      height: 200,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: const Color(0xff19C463),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            left: 20,
            top: 20,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Clearance",
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const Text(
                  "Sales",
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                  ),
                  onPressed: () {},
                  child: const Text(
                    "Up to 50%",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                )
              ],
            ),
          ),
          Positioned(
            right: 0,
            top: -10,
            child: Image.asset(
              "assets/images/iphone_banner.png",
              width: 210,
              height: 210,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  width: 210,
                  height: 210,
                  color: Colors.grey.shade300,
                  child: const Icon(Icons.image_not_supported),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearch() {
    return Container(
      width: double.infinity,
      height: 50,
      decoration: BoxDecoration(
          color: Colors.grey[200], borderRadius: BorderRadius.circular(10)),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Padding(
            padding: EdgeInsets.only(left: 16.0),
            child: Text(
              "Search products...",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ),
          Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: Icon(Icons.search, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
