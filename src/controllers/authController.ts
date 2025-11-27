import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const signup = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({ message: "User already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email, password: hashedPassword
        })
        res.status(201).json({message: "Signup successful", user});
    }catch(error){
        res.status(500).json({ message: "Error during signup", error });
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET!,
            {expiresIn:"7d"}
        );

        res.status(200).json({message: "Login successfull", token, user});
    }catch(error){
        res.status(500).json({ message: "Error during login", error });
    }
}