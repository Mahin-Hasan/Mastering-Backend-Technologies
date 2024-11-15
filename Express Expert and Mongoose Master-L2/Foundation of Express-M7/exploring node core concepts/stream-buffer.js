const http = require("http");
const fs = require("fs");

//creating a server using raw node.js

const server = http.createServer();

//listener
server.on("request", (req, res) => {
  //   console.log(req);
  console.log(req.url, req.method);
  if (req.url === "./read-file" && req.method === "GET");
  // const readableStream = fs.createReadStream('./texts/read.txt')
  // const readableStream = fs.createReadStream(__dirname+'/texts/read.txt')
  const readableStream = fs.createReadStream(process.cwd() + "/texts/read.txt");
  readableStream.on("data", (buffer) => {
    res.statusCode = 200;
    res.write(buffer);
  });
  readableStream.on("end", () => {
    res.statusCode = 200;
    res.end("The streaming is over");
  });
  readableStream.on("error", (error) => {
    console.log(error);
    res.statusCode = 500;
    res.end("Something went wrong");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port:5000");
});
