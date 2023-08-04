/* eslint-disable no-useless-escape */
const STATUS_OK = 201;

const { PORT = 3001, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const SECRET_KEY = 'most-secret-key';

const URL_REG_EXP = /^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/;
const EMAIL_REG_EXP = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

const allowedCors = [
  'http://localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  STATUS_OK,
  PORT,
  DB_URL,
  SECRET_KEY,
  URL_REG_EXP,
  EMAIL_REG_EXP,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
