const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
/* The above code is creating a new user and saving it to the database. */
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    //if user is valid, return the status 201 and save the user info to db
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    //if not, return status 500 and error message
    res.status(500).json(err);
  }
});

//Login
/* 1. It is trying to find a user with the username from the request body.
2. If the user is found, it will decrypt the password from the database.
3. It will then convert the password to a string.
4. If the user is not found or the password is not the same as the one in the request body, it will
return a 401 status code with an error message.
5. If the user is found and the password is the same as the one in the request body, it will create
a JWT token and return the user with */
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    //decrypt the password from database
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    //convert password to string
    const ogPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    /**
     * if either of the credential is wrong
     *    return status 401 (error message)
     * else
     *    login successfully and return user in database
     */
    if (!user || ogPassword !== req.body.password) {
      res.status(401).json("Wrong credentials!");
    } else {
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );
      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
    }
  } catch (err) {
    res.status(500).json("Wrong credentials!");
  }
});

module.exports = router;
