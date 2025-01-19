import jwt from "jsonwebtoken";

export const GenerateToken = (userId, res) => {
  try {
    if (!process.env.SECRET_KEY) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent client-side access
      sameSite: "strict", // CSRF protection
      secure: process.env.NODE_ENV !== "development",
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};
