authMiddleware.authentication = async (req, res, next) => {
    try {
      const secretOrKey = await getSetting('auth', 'token', 'secret_key');
      let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
      if (token && token.length) {
        token = token.replace('Bearer ', '');
        const d = await jwt.verify(token, secretOrKey);
        req.user = d;
        let passed = await loginLogSch.findOne({ token, is_active: true });
        if (passed) {
          return next();
        } else {
          return otherHelper.sendResponse(res, HttpStatus.UNAUTHORIZED, false, null, null, 'Session Expired', null);
        }
      }
      return otherHelper.sendResponse(res, HttpStatus.UNAUTHORIZED, false, null, token, 'token not found', null);
    } catch (err) {
      return next(err);
    }
  };

  authMiddleware.authenticationForLogout = async (req, res, next) => {
    try {
      const secretOrKey = await getSetting('auth', 'token', 'secret_key');
      let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
      if (token && token.length) {
        token = token.replace('Bearer ', '');
        const d = await jwt.verify(token, secretOrKey);
        req.user = d;
        return next();
      }
      return otherHelper.sendResponse(res, HttpStatus.UNAUTHORIZED, false, null, token, 'token not found', null);
    } catch (err) {
      return next(err);
    }
  };