import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../helpers/token/tokenHandler";
import User from "../database/models/user";

const JWT_SECRET = process.env.JWT_SECRET || "adoadovceviado";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "adoadoadovceviado";

export async function signUp(req: Request, res: Response) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Some field is missing" });
    }

    const userIsExist = await User.find({ email: email });

    if (userIsExist.length > 0) {
      return res.status(401).json({ message: "User already registered" });
    }

    const newUser = new User({
      name,
      email,
      state: "active",
      level: "user",
      password,
    });

    const accessToken = await generateToken(
      { userId: newUser._id },
      JWT_SECRET,
      "30m",
    );
    const refreshToken = await generateToken(
      { userId: newUser._id },
      REFRESH_TOKEN_SECRET,
      "1d",
    );

    newUser.refreshToken = refreshToken;

    await newUser.save();

    newUser.refreshToken = "";
    newUser.password = "";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Apenas enviar sobre HTTPS em produção
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "Registration completed successfully",
      accessToken,
      user: newUser,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // console.error("[SignUp] ERROR:\n", error);
      return res.status(500).json({ message: error.message });
    }

    res.status(500).json({ message: "Error signing up user" });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = await generateToken(
      { userId: user._id },
      JWT_SECRET,
      "30m",
    );
    const refreshToken = await generateToken(
      { userId: user._id },
      REFRESH_TOKEN_SECRET,
      "1d",
    );

    user.refreshToken = refreshToken;
    await user.save();

    user.refreshToken = "";
    user.password = "";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Apenas enviar sobre HTTPS em produção
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ accessToken, user });
  } catch (error) {
    // console.error("[SignIn] ERROR:\n", error);
    res.status(500).json({ message: "Error signing in user" });
  }
}

export async function renewAccessToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verificar o refresh token
    const dataVerifyToken = await verifyToken(
      refreshToken,
      REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(dataVerifyToken.payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = await generateToken(
      { userId: user.id },
      JWT_SECRET,
      "1d",
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("[RenewAccessToken] ERROR:\n", error);
    res.status(500).json({ message: "Error renewing access token" });
  }
}

export function recoverPassword(req: Request, res: Response) {
  // Lógica para recuperação de senha
}
