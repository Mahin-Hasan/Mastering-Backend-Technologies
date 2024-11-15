// file system module

const fs = require('fs') 

// reading a file
const readText = fs.readFileSync("./texts/read.txt",'utf-8')


// write a text

const writtenText = fs.writeFileSync('./texts/write.txt',readText + "My input text")

console.log(writtenText);


// doing this operation in asynchronus way