const mongoose = require('../db');

// User schema for registration
const RegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Registration = mongoose.model("Registration", RegistrationSchema);

// User schema for authentication
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  token: String,
});

const User = mongoose.model("User", UserSchema);

// Category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
});

const Category = mongoose.model('Category', categorySchema);

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  packsize: { type: Number, default: 0 },
  mrp: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
});

const Product = mongoose.model('Product', productSchema);

module.exports = {
  User,
  Registration,
  Category,
  Product,
};
