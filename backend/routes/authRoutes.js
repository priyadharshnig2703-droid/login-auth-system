
const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTRATION API
router.post("/register", async (req, res) => {
try {
     const { name, password } = req.body;
     const normalizedEmail = req.body.email?.trim().toLowerCase();
     if (!name?.trim() || !normalizedEmail || !password) {
    return res.status(400).json({
  message: "All fields are required"
 });
}
 if (password.length < 6) {
return res.status(400).json({
message: "Password must be at least 6 characters"
});
}
const existingUser = await User.findOne({
email: normalizedEmail
 });
if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// LOGIN API - separate from Registration API
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        // Compare entered password with stored hash
const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
);

// Check password
if (!isPasswordCorrect) {
    return res.status(401).json({
        message: "Invalid email or password"
    });
}

        // Generate JWT token
const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);

// Send login success response
res.status(200).json({
    message: "Login successful!",
    token: token,
    user: {
        name: user.name,
        email: user.email
    }
});

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});
// PROTECTED API
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile accessed successfully!",
            user: user
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// EXPORT ROUTER
module.exports = router;
