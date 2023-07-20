const JWT = require('jsonwebtoken');

const SECRET_KEY = 'most-secret-key';

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.Cookie || !req.Cookie.jwt) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = req.Cookie.jwt;
  let payload;
  try { payload = JWT.verify(token, SECRET_KEY); } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
