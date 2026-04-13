import User from "../models/user.model.js";
import argon from "argon2";
import jwt from "jsonwebtoken";
import "dotenv/config";

const register = async (req, res) => {
    try {
        let { name, email, password, role, isActive } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already Registered" });
        }

        role = role || "viewer";
        isActive = isActive ?? true;

        const hashPass = await argon.hash(password);

        await User.create({
            name,
            email,
            password: hashPass,
            role,
            isActive
        });

        res.status(201).json({ message: "User Register Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are Required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "User is inactive" });
        }

        const verify = await argon.verify(user.password, password);

        if (!verify) {
            return res.status(401).json({ message: "Email or Password are Invalid" });
        };

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        res.status(200).json({ message: "Login Successfully", token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export { register, login }