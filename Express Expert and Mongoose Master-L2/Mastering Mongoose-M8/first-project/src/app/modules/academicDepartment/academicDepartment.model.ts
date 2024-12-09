import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
//@ts-ignore
import httpStatus from 'http-status';
const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

// handling duplicate department check using pre middleware || if this middleware is commented then mongoose validation will show error response
//if commented then handleDuplicateError function will trigger
academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This department already exists !!',
    );
  }
  next();
});

//handling wrong id update with proper error message using query middleware
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery(); //{ _id: '6754bf3714ab3f4848831e41' }

  const isDepartmentExist = await AcademicDepartment.findOne(query);

  if (!isDepartmentExist) {
    //this error method works but it does not provide proper status code. giving 500 but it should be 404 bz it does not exist
    // throw new Error('This department does not exist !');
    //using extended class to solve this proper status code error || also adjust global error handler
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This department does not exist !',
    );
    // NOTE: fix previously added status code from Error to AppError
  }

  next(); // next must be called or else it will not go to service
});
export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
