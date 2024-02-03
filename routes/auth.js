// Authentication Source Code:

// Importing Useful Links and Dependencies:
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
// Put in environment variable:
const JWT_SECRET = "NoteBookAuthoriedByDishuMavi9625626405";

// Create a user using: POST "/api/auth/createUser". Doesn't require authentication
router.post(
  "/createUser",
  [
    // validation
    body("email", "enter a valid email").isEmail(),
    body("psswd", "enter a valid password").isLength({ min: 6 }),
    body("name", "name must not be empty").isLength({ min: 4 }),
  ],
  async (req, res) => {
    //(request,response)
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    } else {
      console.log("Successfully Validated:");
      console.log(req.body);
    }
    const { name, email, psswd } = req.body; //destructuring

    try {
      //Check if the email is already registered
      const existingUser = await User.findOne({ email }); //await used we need to wait for the promise to resolve
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" }); // returing 400 bad response
      }
      const salt = await bcrypt.genSaltSync(10);

      // Using bcrypt to generate hash value of a password and salting it
      const secPasswd = await bcrypt.hash(psswd, salt);

      // create a new user instance:
      let user = await User.create({
        name: req.body.name,
        email: req.body.email,
        psswd: secPasswd,
      });

      // Sending response
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      // save the new user:
      await user.save();
      success = true;
      // respond with authentication token:
      res.json({ success, authToken });
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Login a user using: POST "/api/auth/login". Doesn't require authentication
router.post(
  "/login",
  [
    // validation
    body("email", "enter a valid email").isEmail(),
    body("psswd", "password can not be blank").exists(), // not blank
  ],
  async (req, res) => {
    //(request,response)
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Errors Occurred:", errors: errors.array() });
    }

    // Input Email & Password
    const { email, psswd } = req.body;
    try {
      // User Extraction
      let user = await User.findOne({ email });

      // Handling user doen't exits case:
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Try to login with correct credentials." });
      }

      const psswdCompare = await bcrypt.compare(psswd, user.psswd); // checking whether the entered password  matches with the password in the database or not.

      // if the psswd is not correct
      if (!psswdCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Try to login with correct credentials." });
      }

      // Sending response if the login is successfull:
      const data = {
        user: {
          id: user.id,
        },
      };
      console.log(user);
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, name: user.name, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(400).send("Internal server error!");
    }
  }
);

// Get LoggedIn user details using: POST "/api/auth/getUser". No login required.
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId.id).select("-psswd");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
