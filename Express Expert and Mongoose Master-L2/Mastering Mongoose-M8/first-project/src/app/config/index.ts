import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') }); // joining dot env with curr dir

export default {
  port: process.env.PORT,
  databse_url: process.env.DATABASE_URL,
};
