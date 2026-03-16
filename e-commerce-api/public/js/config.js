const apiConfig = {
  baseUrl: "https://e-commerce-api-24yv.onrender.com/api",
  authentication: {
    description:
      "Most endpoints require authentication. Include your API key in the request header.",
    example: "Authorization: Bearer YOUR_API_KEY",
  },
  sections: [
    {
      id: "base-url",
      title: "Base URL",
      type: "simple",
      content: "https://e-commerce-api-24yv.onrender.com/api",
      showInNav: true,
    },
    {
      id: "authentication",
      title: "Authentication",
      type: "simple",
      content: {
        description:
          "Most endpoints require authentication. Include your API key in the request header.",
        example: "Authorization: Bearer YOUR_API_KEY",
        note: "User registration and login endpoints don't require authentication.",
      },
      showInNav: true,
    },
    {
      id: "products",
      title: "Products",
      type: "endpoints",
      showInNav: true,
      endpoints: [
        {
          method: "GET",
          path: "/api/products",
          requiresAuth: true,
          title: "Get All Products",
          description:
            "Retrieve a paginated list of products with filtering, sorting, and searching capabilities.",
          queryParameters: [
            {
              name: "search",
              type: "string",
              description:
                "Search term to filter products by name, description, or brand",
              required: false,
            },
            {
              name: "categoryId",
              type: "string",
              description: "Filter products by category ID",
              required: false,
            },
            {
              name: "brand",
              type: "string",
              description: "Filter products by brand name",
              required: false,
            },
            {
              name: "minPrice",
              type: "number",
              description: "Minimum price filter",
              required: false,
            },
            {
              name: "maxPrice",
              type: "number",
              description: "Maximum price filter",
              required: false,
            },
            {
              name: "sort",
              type: "string",
              description: "Sort field (prefix with '-' for descending)",
              required: false,
            },
            {
              name: "page",
              type: "number",
              description: "Page number (default: 1)",
              required: false,
            },
            {
              name: "limit",
              type: "number",
              description: "Number of items per page (default: 10)",
              required: false,
            },
            {
              name: "ratings",
              type: "number",
              description: "Filter products by minimum rating",
              required: false,
            },
            {
              name: "topSelling",
              type: "boolean",
              description: "Set to 'true' to sort by top selling products",
              required: false,
            },
          ],
          response: {
            success: true,
            total: 100,
            currentPage: 1,
            totalPages: 10,
            count: 10,
            products: [
              {
                _id: "123",
                name: "Laptop",
                description: "High-performance laptop",
                price: 899.99,
                categoryId: "electronics123",
                brand: "Dell",
                stock: 20,
                ratings: 4.2,
                reviews: [],
                images: [{ url: "https://example.com/image1.jpg" }],
                createdBy: "user123",
                createdAt: "2025-01-01T12:00:00Z",
                updatedAt: "2025-01-05T09:00:00Z",
              },
            ],
          },
        },
        {
          method: "GET",
          path: "/api/products/category/:categoryId",
          requiresAuth: true,
          title: "Get Products by Category",
          description: "Retrieve all products for a specific category.",
          parameters: [
            {
              name: "categoryId",
              type: "string",
              description: "The ID of the category",
              required: true,
            },
          ],
          response: {
            success: true,
            data: [
              {
                _id: "123",
                name: "Laptop",
                description: "High-performance laptop",
                price: 899.99,
                categoryId: "electronics123",
                brand: "Dell",
                stock: 20,
                images: [{ url: "https://example.com/image1.jpg" }],
              },
            ],
          },
        },
        {
          method: "POST",
          path: "/api/products",
          requiresAuth: true,
          title: "Create Product",
          description: "Create a new product with image uploads.",
          consumes: ["multipart/form-data"],
          parameters: [
            {
              name: "images",
              type: "file[]",
              description: "Product images",
              required: true,
            },
            {
              name: "name",
              type: "string",
              description: "Product name",
              required: true,
            },
            {
              name: "description",
              type: "string",
              description: "Product description",
              required: false,
            },
            {
              name: "price",
              type: "number",
              description: "Product price",
              required: true,
            },
            {
              name: "categoryId",
              type: "string",
              description: "Category ID",
              required: true,
            },
            {
              name: "brand",
              type: "string",
              description: "Product brand",
              required: false,
            },
            {
              name: "stock",
              type: "number",
              description: "Product stock quantity",
              required: false,
            },
          ],
          response: {
            success: true,
            message: "Product created successfully",
            data: {
              _id: "123",
              name: "New Product",
              description: "Created product",
              price: 100,
              categoryId: "cat001",
              brand: "Apple",
              stock: 100,
              images: [{ url: "https://example.com/img.jpg" }],
              createdBy: "userId",
              createdAt: "2025-01-01T12:00:00Z",
            },
          },
        },
        {
          method: "PUT",
          path: "/api/products/:id",
          requiresAuth: true,
          title: "Update Product",
          description: "Update a product you created.",
          parameters: [
            {
              name: "id",
              type: "string",
              description: "Product ID",
              required: true,
            },
            {
              name: "body",
              type: "object",
              description: "Fields to update",
              required: true,
              schema: {
                name: { type: "string", required: false },
                description: { type: "string", required: false },
                price: { type: "number", required: false },
                categoryId: { type: "string", required: false },
                brand: { type: "string", required: false },
                stock: { type: "number", required: false },
                isActive: { type: "boolean", required: false },
              },
            },
          ],
          response: {
            success: true,
            message: "Product updated successfully",
            data: {
              _id: "123",
              name: "Updated Name",
              price: 199.99,
              updatedAt: "2025-01-10T15:30:00Z",
            },
          },
        },
        {
          method: "DELETE",
          path: "/api/products/:id",
          requiresAuth: true,
          title: "Delete Product",
          description: "Delete a product you created.",
          parameters: [
            {
              name: "id",
              type: "string",
              description: "Product ID",
              required: true,
            },
          ],
          response: {
            success: true,
            message: "Product deleted successfully",
            data: {
              _id: "123",
              name: "Deleted Product",
            },
          },
        },
        {
          method: "GET",
          path: "/api/products/my-products",
          requiresAuth: true,
          title: "Get My Products",
          description:
            "Retrieve all products created by the current user with statistics.",
          response: {
            success: true,
            data: {
              products: [
                {
                  _id: "123",
                  name: "My Product",
                  price: 99.99,
                  categoryId: { _id: "cat123", name: "Electronics" },
                  brand: "My Brand",
                  stock: 10,
                  isActive: true,
                },
              ],
              stats: {
                totalProducts: 5,
                totalStock: 50,
                outOfStock: 1,
                inStock: 4,
                activeProducts: 4,
                inactiveProducts: 1,
              },
            },
          },
        },
      ],
    },
    {
      id: "brands",
      title: "Brands",
      type: "endpoints",
      showInNav: true,
      endpoints: [
        {
          method: "GET",
          path: "/api/brands",
          requiresAuth: true,
          title: "Get All Brands",
          description:
            "Retrieve all brands created by the current user with product count statistics.",
          response: {
            success: true,
            data: [
              {
                _id: "5f8d8f7d8f7d8f7d8f7d8f7d",
                name: "Example Brand",
                description: "Brand description",
                image:
                  "https://res.cloudinary.com/example/image/upload/v1234567890/brand.jpg",
                totalProducts: 15,
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z",
              },
            ],
          },
        },
        {
          method: "GET",
          path: "/api/brands/:id",
          requiresAuth: true,
          title: "Get Brand by ID",
          description:
            "Retrieve a specific brand by its ID (only if created by the current user).",
          parameters: [
            {
              name: "id",
              type: "string",
              description: "Brand ID",
              required: true,
            },
          ],
          response: {
            success: true,
            data: {
              _id: "5f8d8f7d8f7d8f7d8f7d8f7d",
              name: "Example Brand",
              description: "Brand description",
              image:
                "https://res.cloudinary.com/example/image/upload/v1234567890/brand.jpg",
              createdBy: "5f8d8f7d8f7d8f7d8f7d8f7d",
              createdAt: "2025-01-01T00:00:00.000Z",
              updatedAt: "2025-01-01T00:00:00.000Z",
            },
          },
          errorResponse: {
            status: 404,
            error: "Brand not found",
          },
        },
        {
          method: "POST",
          path: "/api/brands",
          requiresAuth: true,
          title: "Create Brand",
          description: "Create a new brand with optional image upload.",
          consumes: ["multipart/form-data"],
          parameters: [
            {
              name: "images",
              type: "file[]",
              description:
                "Brand image (first image will be used if multiple are provided)",
              required: false,
            },
            {
              name: "name",
              type: "string",
              description: "Brand name",
              required: true,
            },
            {
              name: "description",
              type: "string",
              description: "Brand description",
              required: false,
            },
          ],
          response: {
            success: true,
            data: {
              _id: "5f8d8f7d8f7d8f7d8f7d8f7d",
              name: "New Brand",
              description: "Brand description",
              image:
                "https://res.cloudinary.com/example/image/upload/v1234567890/brand.jpg",
              createdBy: "5f8d8f7d8f7d8f7d8f7d8f7d",
              createdAt: "2025-01-01T00:00:00.000Z",
              updatedAt: "2025-01-01T00:00:00.000Z",
            },
          },
          errorResponse: {
            status: 400,
            error: "Validation error message",
          },
        },
        {
          method: "PUT",
          path: "/api/brands/:id",
          requiresAuth: true,
          title: "Update Brand",
          description:
            "Update an existing brand (only if created by the current user). Supports image update.",
          consumes: ["multipart/form-data"],
          parameters: [
            {
              name: "id",
              type: "string",
              description: "Brand ID",
              required: true,
            },
            {
              name: "images",
              type: "file[]",
              description:
                "New brand image (first image will be used if multiple are provided)",
              required: false,
            },
            {
              name: "name",
              type: "string",
              description: "Updated brand name",
              required: false,
            },
            {
              name: "description",
              type: "string",
              description: "Updated brand description",
              required: false,
            },
          ],
          response: {
            success: true,
            data: {
              _id: "5f8d8f7d8f7d8f7d8f7d8f7d",
              name: "Updated Brand",
              description: "Updated description",
              image:
                "https://res.cloudinary.com/example/image/upload/v1234567890/new_brand.jpg",
              createdBy: "5f8d8f7d8f7d8f7d8f7d8f7d",
              createdAt: "2025-01-01T00:00:00.000Z",
              updatedAt: "2025-01-02T00:00:00.000Z",
            },
          },
          errorResponses: [
            {
              status: 404,
              error: "Brand not found",
            },
            {
              status: 400,
              error: "Validation error message",
            },
          ],
        },
        {
          method: "DELETE",
          path: "/api/brands/:id",
          requiresAuth: true,
          title: "Delete Brand",
          description: "Delete a brand (only if created by the current user).",
          parameters: [
            {
              name: "id",
              type: "string",
              description: "Brand ID",
              required: true,
            },
          ],
          response: {
            success: true,
            message: "Brand deleted successfully",
          },
          errorResponse: {
            status: 404,
            error: "Brand not found",
          },
        },
      ],
      notes: [
        "All endpoints require authentication",
        "Image uploads are processed through Cloudinary",
        "Brands are user-specific - users can only access brands they created",
        "The GET /brands endpoint includes product count statistics for each brand",
      ],
    },
    {
      id: "categories",
      title: "Categories",
      type: "endpoints",
      showInNav: true,
      endpoints: [
        {
          method: "GET",
          path: "/api/categories",
          requiresAuth: true,
          title: "Get All Categories",
          description:
            "Retrieve a list of all product categories created by the authenticated user.",
          response: {
            success: true,
            count: 1,
            data: [
              {
                id: "60f8c8b2a4d3f9b9c8d7e3e9",
                name: "Electronics",
                description: "Electronic gadgets and devices",
                parenCategory: null,
                isActive: true,
                createdBy: "user_id",
                createdAt: "2023-01-01T00:00:00.000Z",
              },
            ],
          },
        },
        {
          method: "POST",
          path: "/api/categories",
          requiresAuth: true,
          title: "Create Category",
          description: "Create a new product category.",
          requestBody: {
            name: "string (required)",
            description: "string (optional)",
            parenCategory: "ObjectId (optional)",
            isActive: "boolean (optional)",
          },
          response: {
            success: true,
            message: "Category created successfully",
            data: {
              id: "60f8c8b2a4d3f9b9c8d7e3e9",
              name: "Electronics",
              description: "Electronic gadgets and devices",
              parenCategory: null,
              isActive: true,
              createdBy: "user_id",
              createdAt: "2023-01-01T00:00:00.000Z",
            },
          },
        },
        {
          method: "PUT",
          path: "/api/categories/:id",
          requiresAuth: true,
          title: "Update Category",
          description: "Update an existing product category.",
          requestBody: {
            name: "string (optional)",
            description: "string (optional)",
            parenCategory: "ObjectId (optional)",
            isActive: "boolean (optional)",
          },
          response: {
            success: true,
            message: "Category updated successfully",
            data: {
              id: "60f8c8b2a4d3f9b9c8d7e3e9",
              name: "Updated Category",
              description: "Updated description",
              parenCategory: null,
              isActive: true,
              createdBy: "user_id",
              createdAt: "2023-01-01T00:00:00.000Z",
            },
          },
        },
        {
          method: "DELETE",
          path: "/api/categories/:id",
          requiresAuth: true,
          title: "Delete Category",
          description: "Delete an existing product category.",
          response: {
            success: true,
            message: "Category deleted successfully",
            data: {
              id: "60f8c8b2a4d3f9b9c8d7e3e9",
              name: "Electronics",
              description: "Electronic gadgets and devices",
              parenCategory: null,
              isActive: true,
              createdBy: "user_id",
              createdAt: "2023-01-01T00:00:00.000Z",
            },
          },
        },
      ],
    },
    {
      id: "users",
      title: "Users",
      type: "endpoints",
      showInNav: true,
      endpoints: [
        {
          method: "POST",
          path: "/api/users/register",
          requiresAuth: false,
          title: "Register User",
          description: "Register a new user with name, email, and password.",
          requestBody: {
            name: "string",
            email: "string",
            password: "string",
          },
          headers: {
            "x-api-secret": "your_api_secret_key",
          },
          response: {
            message: "User registered successfully",
            token: "JWT Token",
            user: {
              id: "string",
              name: "string",
              email: "string",
              role: "string",
            },
          },
        },
        {
          method: "POST",
          path: "/api/users/login",
          requiresAuth: false,
          title: "Login User",
          description: "Login with email and password and receive a token.",
          requestBody: {
            email: "string",
            password: "string",
          },
          headers: {
            "x-api-secret": "your_api_secret_key",
          },
          response: {
            message: "Login successful",
            token: "JWT Token",
            user: {
              id: "string",
              name: "string",
              email: "string",
              role: "string",
            },
          },
        },
        {
          method: "GET",
          path: "/api/users",
          requiresAuth: true,
          title: "Get All Users",
          description: "Returns all users in the system.",
          headers: {
            Authorization: "Bearer <token>",
          },
          response: {
            users: [
              {
                id: "string",
                name: "string",
                email: "string",
                role: "string",
              },
            ],
          },
        },
        {
          method: "GET",
          path: "/api/users/profile",
          requiresAuth: true,
          title: "Get Profile",
          description: "Retrieve current logged-in user profile.",
          headers: {
            Authorization: "Bearer <token>",
          },
          response: {
            id: "string",
            name: "string",
            email: "string",
            role: "string",
          },
        },
        {
          method: "PUT",
          path: "/api/users",
          requiresAuth: true,
          title: "Update User",
          description: "Update current user’s profile data.",
          headers: {
            Authorization: "Bearer <token>",
          },
          requestBody: {
            name: "string (optional)",
            email: "string (optional)",
            password: "string (optional)",
          },
          response: {
            message: "User updated successfully",
            data: {
              id: "string",
              name: "string",
              email: "string",
            },
          },
        },
        {
          method: "DELETE",
          path: "/api/users",
          requiresAuth: true,
          title: "Delete User",
          description: "Delete the current authenticated user account.",
          headers: {
            Authorization: "Bearer <token>",
          },
          response: {
            message: "User has been deleted successfully",
            data: {
              id: "string",
              name: "string",
              email: "string",
            },
          },
        },
        {
          method: "POST",
          path: "/api/users",
          requiresAuth: true,
          title: "Create or Update Cart",
          description:
            "Add product to cart or update quantity if it already exists.",
          headers: {
            Authorization: "Bearer <token>",
          },
          requestBody: {
            items: [
              {
                product: "string (product ID)",
                quantity: "number",
              },
            ],
            user: {
              id: "string (user ID)",
            },
          },
          response: {
            id: "string",
            user: "string",
            items: [
              {
                product: "string",
                quantity: "number",
              },
            ],
            createdAt: "ISODate",
            updatedAt: "ISODate",
          },
        },
      ],
    },

    {
      id: "orders",
      title: "Orders",
      type: "endpoints",
      showInNav: true,
      endpoints: [
        {
          method: "POST",
          path: "/api/orders",
          requiresAuth: true,
          title: "Create Order",
          description: "Place a new order.",
          requestBody: {
            items: [
              { product: "product_id_1", quantity: 2 },
              { product: "product_id_2", quantity: 1 },
            ],
            shippingAddress: {
              address: "123 Main St",
              city: "New York",
              postalCode: "10001",
              country: "USA",
            },
            paymentMethod: "credit_card",
          },
        },
        {
          method: "GET",
          path: "/api/orders/myorders",
          requiresAuth: true,
          title: "Get User Orders",
          description: "Retrieve all orders for the authenticated user.",
        },
      ],
    },
    {
      id: "cart",
      title: "Cart",
      type: "endpoints",
      showInNav: true,
      endpoints: [
        {
          method: "POST",
          path: "/api/cart",
          requiresAuth: true,
          title: "Add Item to Cart",
          description:
            "Add a product to the cart or increase quantity if it already exists.",
          headers: {
            Authorization: "Bearer <token>",
          },
          requestBody: {
            items: [
              {
                product: "string (product ID)",
                quantity: "number",
              },
            ],
          },
          response: {
            message: "Cart updated",
            cart: {
              id: "string",
              user: "string",
              items: [
                {
                  product: "string",
                  quantity: "number",
                },
              ],
              createdAt: "ISODate",
              updatedAt: "ISODate",
            },
          },
        },
        {
          method: "GET",
          path: "/api/cart",
          requiresAuth: true,
          title: "Get User's Cart",
          description: "Retrieve the authenticated user's cart.",
          headers: {
            Authorization: "Bearer <token>",
          },
          response: {
            cart: {
              id: "string",
              user: "string",
              items: [
                {
                  product: {
                    id: "string",
                    name: "string",
                    price: "number",
                  },
                  quantity: "number",
                },
              ],
              createdAt: "ISODate",
              updatedAt: "ISODate",
            },
          },
        },
        {
          method: "PATCH",
          path: "/api/cart/items/:itemId",
          requiresAuth: true,
          title: "Update Cart Item Quantity",
          description: "Update the quantity of a specific item in the cart.",
          headers: {
            Authorization: "Bearer <token>",
          },
          requestBody: {
            quantity: "number",
          },
          response: {
            message: "Quantity updated successfully",
            cart: {
              id: "string",
              items: [
                {
                  product: "string",
                  quantity: "number",
                },
              ],
            },
          },
        },
        {
          method: "DELETE",
          path: "/api/cart",
          requiresAuth: true,
          title: "Delete Entire Cart",
          description: "Delete the entire cart of the current user.",
          headers: {
            Authorization: "Bearer <token>",
          },
          response: {
            message: "Cart deleted successfully",
          },
        },
        {
          method: "DELETE",
          path: "/api/cart/items/:itemId",
          requiresAuth: true,
          title: "Remove Item from Cart",
          description:
            "Remove a specific item from the authenticated user's cart.",
          headers: {
            Authorization: "Bearer <token>",
          },
          response: {
            message: "Item removed successfully",
            cart: {
              id: "string",
              items: [
                {
                  product: "string",
                  quantity: "number",
                },
              ],
            },
          },
        },
      ],
    },

    {
      id: "reviews",
      title: "Reviews",
      type: "notice",
      showInNav: true,
      content:
        "All review endpoints require authentication. Use the <code>/api/reviews</code> route for review operations.",
    },

    {
      id: "wishlist",
      title: "Wishlist",
      type: "endpoints",
      showInNav: true,
      endpoints: [
        {
          method: "GET",
          path: "/api/wishlist",
          requiresAuth: true,
          title: "Get Wishlist",
          description:
            "Retrieve the current user's wishlist with populated product details.",
          headers: {
            Authorization: "Bearer <token>",
          },
          response: {
            message: "Wishlist fetched successfully",
            wishlist: {
              id: "string",
              user: "string",
              products: [
                {
                  id: "string",
                  name: "string",
                  price: "number",
                  description: "string",
                },
              ],
            },
          },
        },
        {
          method: "POST",
          path: "/api/wishlist",
          requiresAuth: true,
          title: "Add to Wishlist",
          description: "Add a product to the authenticated user's wishlist.",
          headers: {
            Authorization: "Bearer <token>",
          },
          requestBody: {
            productId: "string (Product ID)",
          },
          response: {
            message: "Product added to wishlist",
            wishlist: {
              id: "string",
              products: ["string (Product ID)"],
            },
          },
        },
        {
          method: "DELETE",
          path: "/api/wishlist/:productId",
          requiresAuth: true,
          title: "Remove from Wishlist",
          description:
            "Remove a specific product from the authenticated user's wishlist.",
          headers: {
            Authorization: "Bearer <token>",
          },
          pathParams: {
            productId: "string (Product ID to remove)",
          },
          response: {
            message: "Product removed from wishlist",
            wishlist: {
              id: "string",
              products: ["string (Remaining Product IDs)"],
            },
          },
        },
      ],
    },
    {
      id: "errors",
      title: "Error Responses",
      type: "errors",
      showInNav: true,
      errors: [
        {
          code: "400",
          title: "Bad Request",
          example: {
            success: false,
            error: "Validation Error",
            message: "Name is required",
          },
        },
      ],
    },
  ],
};
