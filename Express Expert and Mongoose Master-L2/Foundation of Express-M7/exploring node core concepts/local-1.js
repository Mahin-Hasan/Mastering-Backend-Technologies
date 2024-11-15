const add = (param1, param2) => param1 + param2;
const a = 10;
//common js syntax
// module.exports = add

// if we need to pass variable and function than we need to attach it

module.exports = {
  a,
  add,
};
