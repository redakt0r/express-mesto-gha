const JWT = require('jsonwebtoken');

const SECRET_KEY = 'most-secret-key';

/*module.exports.generateToken = (payload) => JWT.sign(payload, SECRET_KEY, { expiresIn: '7d' });

 module.exports.checkToken = (token) => {
  if (!token) {
    return false;
  }
  try {
    return JWT.verify(token, SECRET_KEY)
  } catch {
    return false;
  };
} */

function generateToken(payload) {
  return JWT.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return JWT.verify(token, SECRET_KEY)
  } catch {
    return false;
  }
};

module.exports = {generateToken, checkToken}