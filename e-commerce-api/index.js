require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const WebSocket = require('ws');

const authMiddleware = require("./Middleware/auth-middlewar");

const app = express();
const PORT = process.env.PORT || 4000;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!mongoUri) {
      throw new Error("MongoDB connection string is missing in .env file");
    }
    await mongoose.connect(mongoUri,{
      dbName: 'test'
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use((req, res, next) => {
const start = Date.now();
res.on('finish', () => { 
const duration = Date.now() - start;
console.log(
`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
);
});
next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api/products", require("./routers/productRoutes"));
app.use("/api/categories", require("./routers/categoryRoutes"));
app.use("/api/users", require("./routers/userRoutes"));
app.use("/api/orders", authMiddleware, require("./routers/orderRoutes"));
app.use("/api/carts", authMiddleware, require("./routers/cartRoutes"));
app.use("/api/reviews", authMiddleware, require("./routers/reviewRoutes"));
app.use("/api/wishlists", authMiddleware, require("./routers/wishlistRoutes"));
app.use("/api/brands", require("./routers/brand.routes"));

const wss = new WebSocket.Server({ port: 8080 });
const riders = new Set();
const users = new Set();

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'identify') {
        if (data.role === 'rider') {
          riders.add(ws);
          console.log('Rider connected');
        } else if (data.role === 'user') {
          users.add(ws);
          console.log('User connected');
        }
      } else if (data.type === 'locationUpdate') {
        const { orderId, latitude, longitude } = data;
        console.log(`Updated location for order ${orderId}: ${latitude}, ${longitude}`);
        users.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'locationUpdate',
                orderId,
                latitude,
                longitude,
              })
            );
          }
        });
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    riders.delete(ws);
    users.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);