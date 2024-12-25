export const USER_ROLE = {
  // used for authorization
  student: 'student',
  faculty: 'faculty',
  admin: 'admin',
} as const; // bz we don't want it to be modified

export const UserStatus = ['in-progress', 'blocked'];
