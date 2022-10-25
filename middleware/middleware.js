const jwt = require("jsonwebtoken");
const authMiddleware = {};

authMiddleware.authentication = async (req, res, next) => {
  try {
    let token =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.headers.authorization ||
      req.headers.token ||
      req.cookies.accessToken;

    if (token && token.length) {
      // token = token.replace("Bearer ", "");
      // console.log("replace token", token);
      const d = await jwt.verify(token, process.env.JWT_SEC);
      req.user = d;
      return next();
    }
    return res.status(401).json({ message: "You are not authenticated!" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

authMiddleware.authenticationForLogout = async (req, res, next) => {
  try {
    const secretOrKey = await getSetting("auth", "token", "secret_key");
    let token =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.headers.authorization ||
      req.headers.token;
    if (token && token.length) {
      token = token.replace("Bearer ", "");
      const d = await jwt.verify(token, secretOrKey);
      req.user = d;
      return next();
    }
    return otherHelper.sendResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      null,
      token,
      "token not found",
      null
    );
  } catch (err) {
    return next(err);
  }
};

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files");
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "--" + file.originalname;
    req.filename = filename;
    cb(null, filename);
  },
});

authMiddleware.upload = multer({
  storage: storage,
});

module.exports = authMiddleware;
