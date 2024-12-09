import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';
//3rd layer - triggern when get with specific ID
const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;
/*
    //cast error structure
    "err": {
        "stringValue": "\"6754bf3714ab3f4848831e4\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "6754bf3714ab3f4848831e4",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"6754bf3714ab3f4848831e4\" (type string) at path \"_id\" for model \"AcademicDepartment\""
    },
*/
