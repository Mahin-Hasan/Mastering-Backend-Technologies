import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';
//4th layer - triggern when we want to create a dept with same name
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  //Extracting value inside double quotes
  const match = err.message.match(/"([^"]*)"/);
  //The Extracted message
  const extractedMessage = match && match[1];
  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} already Exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Duplicate Dept Name',
    errorSources,
  };
};

export default handleDuplicateError;

/*
 "message": "E11000 duplicate key error collection: first-project.academicdepartments index: name_1 dup key: { name: \"Department of computer Science and engineering\" }",
  "err": {
        "errorResponse": {
            "index": 0,
            "code": 11000,
            "errmsg": "E11000 duplicate key error collection: first-project.academicdepartments index: name_1 dup key: { name: \"Department of computer Science and engineering\" }",
            "keyPattern": {
                "name": 1
            },
            "keyValue": {
                "name": "Department of computer Science and engineering"
            }
        },
        "index": 0,
        "code": 11000,
        "keyPattern": {
            "name": 1
        },
        "keyValue": {
            "name": "Department of computer Science and engineering"
        }
    },
*/
