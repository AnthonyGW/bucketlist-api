var createError = require('../utils').createError;

function requiresLogin(req, res, next){
  if(!req.session || !req.session.userId)
    return next(createError('Access denied. User must be logged in.', 403));

  return next();
}

module.exports.requiresLogin = requiresLogin;