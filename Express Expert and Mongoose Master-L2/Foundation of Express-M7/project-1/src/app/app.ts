// const express = require("express");
// import syntax
import express, { NextFunction, Request, Response } from "express";

const app = express();
const port = 5000;

//need parser to get undefined val
app.use(express.json());
app.use(express.text()); // when sending text datas

//routers

const userRouter = express.Router();
const courseRouter = express.Router();
app.use("/api/v1/users", userRouter); // must be used or api will not work
app.use("/api/v1/courses", courseRouter); // must be used or api will not work

userRouter.post("/create-user", (req: Request, res: Response) => {
  const user = req.body;
  console.log(user);
  res.json({
    success: true,
    message: "User is created successfully",
    data: user,
  });
});

courseRouter.post("/create-course", (req: Request, res: Response) => {
  const course = req.body;
  console.log(course);
  res.json({
    success: true,
    message: "Course is created successfully",
    data: course,
  });
});

// app.get("/:userId/:subId", (req: Request, res: Response) => {
//   console.log(req.params);
//   res.send("Hellow Developers!!!");
// });

//middleware used in authentication
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url, req.method, req.hostname);
  next();
};

//working get
// app.get("/", logger, (req: Request, res: Response) => {
//   console.log(req.query);
//   res.send("Hellow Developers!!!");
// });

//error handling
// app.get("/", logger, (req: Request, res: Response) => {
//   try {
//     res.send(something);
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "failed to get data",
//     });
//   }
// });
//doing the same error handling from a global scope
app.get("/", logger, (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(something); // intentionally creating error to check global error handler
  } catch (error) {
    // console.log(error);
    next(error); // directly sends error message type to global middle ware
    // res.status(400).json({
    //   success: false,
    //   message: "failed to get data",
    // });
  }
});
app.post("/", logger, (req: Request, res: Response) => {
  console.log(req.body);
  //   res.send("got Data")
  res.json({
    message: "Successfully received data",
  });
});

// giving custom errors | triggered when http://localhost:5000/asd is get
app.all("*", (req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    message: "Route is not defined",
  });
});

//global error handler | must be decladred at the end
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  // console.log(error);// error is directly passed from next(error)
  if (error) {
    res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
});

export default app;
