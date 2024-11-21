import { IUser } from './user.interface';
import User from './user.model';

const createUser = async (userData: IUser): Promise<IUser> => {
  // must declare interface type so that the ts error is can be solved
  const result = await User.create(userData);

  return result;
};

const getUser = async () => {
  const result = await User.find();
  return result;
};
const getSingleUser = async (id: string) => {
  const result = await User.findById(id); // searching by object id || use findOne for searching with other field value
  return result;
};
const updateUser = async (id: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(id, data);
  return result;
};
const deleteUser = async (id: string) => { // make sure to delete by adding a flag and then conditionally render
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const userService = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
