import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  //next - will allow us to have the func continue
  try {
    let token = req.header("Authorization"); //grab from the frontend authorization header

    if (!token) return res.status(403).send("Access Denied");

    if (token.startsWith("Bearer ")) {
      //want the token be starting with bearer
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET); //using the secret string
    req.user = verified;
    next(); //use it for the middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
