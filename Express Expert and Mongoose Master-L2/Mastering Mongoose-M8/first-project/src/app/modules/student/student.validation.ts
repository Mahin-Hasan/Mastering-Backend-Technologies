// schema for Zod Validation
import { z } from "zod";

// Sub-schema for UserName
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, { message: "First Name cannot be more than 20 characters" })
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      { message: "First Name must be capitalized" }
    ),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .refine((value) => /^[A-Za-z]+$/.test(value), { message: "Last Name must only contain alphabetic characters" }),
});

// Sub-schema for Guardian
const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, { message: "Father name is required" }),
  fatherOccupation: z.string().min(1, { message: "Father occupation is required" }),
  fatherContactNo: z.string().min(1, { message: "Father contact number is required" }),
  motherName: z.string().min(1, { message: "Mother name is required" }),
  motherOccupation: z.string().min(1, { message: "Mother occupation is required" }),
  motherContactNo: z.string().min(1, { message: "Mother contact number is required" }),
});

// Sub-schema for LocalGuardian
const localGuardianValidationSchema = z.object({
  name: z.string().min(1, { message: "Local guardian name is required" }),
  occupation: z.string().min(1, { message: "Local guardian occupation is required" }),
  contactNo: z.string().min(1, { message: "Local guardian contact number is required" }),
  address: z.string().min(1, { message: "Local guardian address is required" }),
});

// Main Student schema
const studentValidatoinSchemaZod = z.object({
  id: z.string().min(1, { message: "Student ID is required" }),
  name: userNameValidationSchema,
  gender: z.enum(["male", "female", "other"], { message: "Invalid gender value" }),
  dateOfBirth: z.string().optional(),
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Invalid email format" }),
  contactNo: z.string().min(1, { message: "Contact number is required" }),
  emergencyContactNo: z.string().min(1, { message: "Emergency contact number is required" }),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], { message: "Invalid blood group value" })
    .optional(),
  presentAddress: z.string().min(1, { message: "Present address is required" }),
  permanentAddress: z.string().min(1, { message: "Permanent address is required" }),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(["active", "blocked"]).default("active"),
});


export default studentValidatoinSchemaZod;