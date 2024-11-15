"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
// import syntax
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 5000;
//need parser to get undefined val
app.use(express_1.default.json());
app.use(express_1.default.text()); // when sending text datas
//routers
const userRouter = express_1.default.Router();
const courseRouter = express_1.default.Router();
app.use("/api/v1/users", userRouter); // must be used or api will not work
app.use("/api/v1/courses", courseRouter); // must be used or api will not work
userRouter.post("/create-user", (req, res) => {
    const user = req.body;
    console.log(user);
    res.json({
        success: true,
        message: "User is created successfully",
        data: user,
    });
});
courseRouter.post("/create-course", (req, res) => {
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
const logger = (req, res, next) => {
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
app.get("/", logger, (req, res, next) => {
    try {
        res.send(something); // intentionally creating error to check global error handler
    }
    catch (error) {
        // console.log(error);
        next(error); // directly sends error message type to global middle ware
        // res.status(400).json({
        //   success: false,
        //   message: "failed to get data",
        // });
    }
});
app.post("/", logger, (req, res) => {
    console.log(req.body);
    //   res.send("got Data")
    res.json({
        message: "Successfully received data",
    });
});
// giving custom errors | triggered when http://localhost:5000/asd is get
app.all("*", (req, res) => {
    res.status(400).json({
        success: false,
        message: "Route is not defined",
    });
});
//global error handler | must be decladred at the end
app.use((error, req, res, next) => {
    // console.log(error);// error is directly passed from next(error)
    if (error) {
        res.status(400).json({
            success: false,
            message: "something went wrong",
        });
    }
});
exports.default = app;
