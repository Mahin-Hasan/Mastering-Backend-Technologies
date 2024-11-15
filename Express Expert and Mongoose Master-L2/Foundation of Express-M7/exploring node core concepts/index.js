// const myModule = require("./local.1");
// console.log(myModule.add(2, 4));
//local module
const { a, add } = require("./local-1"); // destructuring
const { a: a2, add: add2 } = require("./local-2"); // will give already declared error use alias

console.log(add2(1,2,3));

//built in module

const path = require('path')
// console.log(path.dirname(D:\Study Material\Programming hero Level 2\Mission-2-Express-Mongoose\module-7\index.js)); // will not work this path system bz node js was built in linux and uses linux and mac path systenm

console.log(path.parse("D:/Study Material/Programming hero Level 2/Mission-2-Express-Mongoose/module-7/index.js"));
