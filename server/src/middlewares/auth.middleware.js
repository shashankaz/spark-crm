import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/auth/jwt.js";

export const requireAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies["__auth_at"];
    if (!accessToken) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded || !decoded._id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const userData = await User.findOne({ _id: decoded._id });
    if (!userData) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    req.user = Object.freeze(userData.toJSON());

    next();
  } catch (error) {
    next(error);
  }
};
