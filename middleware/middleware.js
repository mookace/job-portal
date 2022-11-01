const jwt = require("jsonwebtoken");
const multer = require("multer");

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
      token = token.replace("Bearer ", "");
      const d = await jwt.verify(token, process.env.JWT_SEC);
      req.user = d;
      return next();
    }
    return res.status(401).json({ message: "You are not authenticated!" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// authMiddleware.authorization=async(req,res)=>{

// }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/cv");
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "--" + file.originalname;
    req.filename = filename;
    cb(null, filename);
  },
});

authMiddleware.upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mb
  },
}).single("cv");

module.exports = authMiddleware;
