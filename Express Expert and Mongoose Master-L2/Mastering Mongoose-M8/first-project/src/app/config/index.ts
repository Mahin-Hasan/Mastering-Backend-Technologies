import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') }); // joining dot env with curr dir

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  databse_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BYCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
};
