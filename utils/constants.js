const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SOME_ERROR = 400;
const STATUS_OK = 201;

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const SECRET_KEY = 'most-secret-key';

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SOME_ERROR,
  STATUS_OK,
  PORT,
  DB_URL,
  SECRET_KEY,
};
