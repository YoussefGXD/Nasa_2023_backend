import validator from "validator";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const creatToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = async (req, res) => {
  let { name, email, userName, password, role } = req.body;

  let user = await User.findOne({ email });

  if (user) return res.status(400).send("User already exists");

  if (!validator.isEmail(email)) return res.status(400).send("Invalid Email");

  if (!validator.isStrongPassword(password))
    return res.status(400).send("Invalid Password");

  user = new User({ name, email, userName, password, role });

  user.password = await bcrypt.hash(password, 10);

  await user.save();

  const token = creatToken(user._id);

  res.status(200).send({ _id: user._id, name: user.name, email, role, token });
};

const login = async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) return res.status(400).send("Invalid Email or password");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).send("Invalid password");

    const token = creatToken(user._id);

    res
      .status(200)
      .send({ _id: user._id, name: user.name, email, role: user.role, token });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const userController = { register, login };
