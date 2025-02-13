const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Joi = require('joi');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User successfully registered',
            data: savedUser,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};



exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log("Received data:", req.body);
  
      console.log("Email received:", email);
    const user = await User.findOne({ email: email });
    console.log("User found:", user);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        console.log("Is match: ", isMatch);
  
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' } // Token süresi
        );
        console.log(token); 
        
        
      console.log("Generated token:", token); 
  
      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        token: token,
      });
      console.log("Received email:", email);
      console.log("Received password:", password);
      console.log("Stored hashed password:", user.password);
      
    } catch (err) {

      console.error(err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};
