// routes.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// Use the .default property

const { User, Category, Product } = require('../modules/loginModules');

const app = express();


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Dummy database to store reset password tokens
const tokenDatabase = {};

// Replace these values with your email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'samadhanmore2914@gmail.com',
    pass: 'uytgevcxjobstqdv',
  },
});

app.post('/reset-password-request', async (req, res) => {
  const { email } = req.body;

  // Generate a unique token
  const token = crypto.randomBytes(20).toString('hex');

  // Store the token in the database along with the email
  tokenDatabase[token] = email;

  // Construct the reset password link
  const resetLink = `http://localhost:3000/reset-password/${token}`;

  // Send the reset password link via email
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Reset Password',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset password link sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending reset password link.' });
  }
});

app.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Retrieve email associated with the token from the database
  const email = tokenDatabase[token];

  if (!email) {
    return res.status(400).json({ error: 'Invalid or expired token.' });
  }

  // Perform password reset logic (update the password in your database)
  // Here, we're just logging the new password for demonstration purposes
  console.log(`Password reset for email: ${email}, new password: ${newPassword}`);

  // Remove the token from the database after resetting the password
  delete tokenDatabase[token];

  res.status(200).json({ message: 'Password reset successful.' });
});

app.post('/check-registration', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // User is registered
      res.json({ isRegistered: true });
    } else {
      // User is not registered
      res.json({ isRegistered: false });
    }
  } catch (error) {
    console.error('Error checking registration:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Make a request to the external authentication service
    const response = await fetch('https://dummyjson.com/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // Authentication failed
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Authentication succeeded; retrieve the token
    const data = await response.json();
    const token = data.token;

    // Save user information to your database (if needed)
    const newUser = new User({
      email,
      password, // Note: This is only if you want to save the password locally (not recommended for security reasons)
      token,
    });

    await newUser.save();
    console.log('Saved User:', newUser);

    res.json({ token });
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token for the newly registered user
    const token = jwt.sign({ userId: newUser._id }, 'PUJADESHAMUKH', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Internal Server Error for registration' });
  }
});



// Login and Registration route
app.post("/auth", async (req, res) => {
  const { email, password, action } = req.body;

  try {
    let user;

    if (action === 'login') {
      // Login: Find user by email
      user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      // Check if the provided password matches the stored hash
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Authentication failed" });
      }
    } else if (action === 'register') {
      // Registration: Check if user with the email already exists
      user = await User.findOne({ email });

      if (user) {
        return res.status(409).json({ error: "User with this email already exists" });
      }

      // Hash the password before saving to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      user = new User({
        email,
        password: hashedPassword,
      });

      await user.save();
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'PUJADESHAMUKH', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ error: "Authentication failed" });
  }
});

// ... (Other routes remain unchanged)

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ error: "Authentication failed" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Authentication failed" });
//     }

//     const token = jwt.sign({ userId: user._id }, 'PUJADESHAMUKH', { expiresIn: '1h' });

//     res.cookie("jwttoken", token, {
//       expires: new Date(Date.now() + 3600000), // 1 hour
//       httpOnly: true,
//     });

//     res.json({ token });
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     res.status(401).json({ error: "Authentication failed" });
//   }
// });


// Category routes
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ status: 'success', data: categories, message: 'Categories retrieved successfully' });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error for get' });
  }
});

app.post('/categories', async (req, res) => {
  const { name, description, status } = req.body;

  try {
    const newCategory = new Category({ name, description, status });
    await newCategory.save();
    console.log('Saved Category:', newCategory);
    res.json({ status: 'success', data: newCategory, message: 'Category created successfully' });
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error for post' });
  }
});


// Category delete route
app.delete("/categories/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ status: "error", message: "Category not found" });
    }

    res.json({ status: "success", data: deletedCategory, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ status: "error", message: "Internal Server Error for delete" });
  }
});

// Category update route
app.put("/categories/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  const { name, description, status } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, status },
      { new: true } // Return the modified document
    );

    if (!updatedCategory) {
      return res.status(404).json({ status: "error", message: "Category not found" });
    }

    res.json({ status: "success", data: updatedCategory, message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ status: "error", message: "Internal Server Error for put" });
  }
});


// Product routes
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ status: "success", data: products, message: "Products retrieved successfully" });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ status: "error", message: "Internal Server Error for get" });
  }
});

// Product routes
app.post("/products", async (req, res) => {
  const { name, category, packsize, mrp, image, status } = req.body;

  try {
    const newProduct = new Product({ name, category, packsize, mrp, image, status });
    await newProduct.save();
    console.log('Saved Product:', newProduct);

    res.json({ status: "success", data: newProduct, message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ status: "error", message: "Internal Server Error for post" });
  }
});


app.delete("/products/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    res.json({ status: "success", data: deletedProduct, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ status: "error", message: "Internal Server Error for delete" });
  }
});

module.exports = app;
