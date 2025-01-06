export const USER_ROLE = {
  // used for authorization
  superAdmin: 'superAdmin',
  admin: 'admin',
  student: 'student',
  faculty: 'faculty',
} as const; // bz we don't want it to be modified

export const UserStatus = ['in-progress', 'blocked'];
