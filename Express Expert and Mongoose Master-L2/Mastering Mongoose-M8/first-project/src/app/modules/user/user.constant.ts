export const USER_ROLE = {
  // used for authorization
  superAdmin: 'super-admin',
  admin: 'admin',
  student: 'student',
  faculty: 'faculty',
} as const; // bz we don't want it to be modified

export const UserStatus = ['in-progress', 'blocked'];
