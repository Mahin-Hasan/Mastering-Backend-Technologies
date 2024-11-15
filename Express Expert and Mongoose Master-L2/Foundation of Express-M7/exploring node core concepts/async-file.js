const fs = require("fs");

//reading text asynchronously

fs.readFile("./texts/read.txt", "utf-8", (err, data) => {
  if (err) {
    throw Error("Error Reading Text");
  }
  console.log(data);
  // this type of operation creates back pressure as reading takes less time as compared to writing
  fs.writeFile('./texts/read2.txt',data,'utf-8',(err)=>{
    if(err){
        throw Error("Error Writing data");

    }
  })
});
console.log("Testing");
