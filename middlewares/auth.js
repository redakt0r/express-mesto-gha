const JWT = require('jsonwebtoken');

const { SECRET_KEY } = require('../utils/constants');

const AuthorizationError = require('../errors/AuthorizationError');

module.exports.auth = (req, _res, next) => {
  if (!req.cookies.jwt) { throw new AuthorizationError('Необходима авторизация'); }
  const token = req.cookies.jwt;
  let payload;
  try { payload = JWT.verify(token, SECRET_KEY); } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
