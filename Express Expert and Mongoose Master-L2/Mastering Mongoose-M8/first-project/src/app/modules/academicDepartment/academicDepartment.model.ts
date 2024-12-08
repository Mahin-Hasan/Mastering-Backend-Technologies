import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

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

// handling duplicate department check using pre middleware
academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExist) {
    throw new Error('This department already exists !!');
  }
  next();
});

//handling wrong id update with proper error message using query middleware
academicDepartmentSchema.pre('findOneAndUpdate', async function(next){
  const query = this.getQuery() //{ _id: '6754bf3714ab3f4848831e41' }

  const isDepartmentExist = await AcademicDepartment.findOne(query)

  if(!isDepartmentExist){
    throw new Error('This department does not exist !')
  }

  next();// next must be called or else it will not go to service
})
export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
