const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  country: { type: String },
  postalCode: { type: String },
  formattedAddress: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
});
const validateEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validateEmail,
        message: "Please enter a valid email address",
      },
    },
    imageUrl: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    phoneNumber: {
      type: String,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    dateOfBirth: {
      type: Date,
      required: false,
    },

    socialMediaLinks: {
      facebook: { type: String, required: false },
      twitter: { type: String, required: false },
      instagram: { type: String, required: false },
      linkedIn: { type: String, required: false },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
