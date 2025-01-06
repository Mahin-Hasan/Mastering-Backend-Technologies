import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

/* super admin token
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAxIiwicm9sZSI6InN1cGVyQWRtaW4iLCJpYXQiOjE3MzYxMDkwMTUsImV4cCI6MTczNjk3MzAxNX0.1TJ9FsW9H9KGLmrZWJn_s5o5Y3NeZeSoBZE-9z0VeBs
*/
const superUser = {
  id: '0001',
  email: 'mahinhasan3700@gmail.com',
  password: config.super_admin_password, // will hash automatically as pre hook is used is user
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });
  // if not then we will create a super Admin
  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
