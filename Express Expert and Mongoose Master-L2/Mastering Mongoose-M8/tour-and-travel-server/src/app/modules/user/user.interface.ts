export interface IUser {
  name: string; // Must be between 3 and 20 characters
  age: number; // Must be provided
  email: string; // Must be valid and unique
  photo?: string | null; // Optional photo field | null should ebe given or else it will give an error
  role: 'user' | 'admin'; // Must be one of the allowed values
  userStatus: 'active' | 'inactive'; // Must be one of the allowed values
}
