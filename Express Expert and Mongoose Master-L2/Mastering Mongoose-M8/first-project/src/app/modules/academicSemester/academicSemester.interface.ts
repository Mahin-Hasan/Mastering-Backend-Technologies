export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TAcademicSemesterName = 'Autumn' | 'Summer' | 'Fall';
export type TAcademicSemesterCode = '01' | '02' | '03';

export type TAcademicSemester = {
  name: TAcademicSemesterName;
  code: TAcademicSemesterCode;
  year: string;
  startMonth: TMonths;
  endMonth: TMonths;
};
export type TAcademicSemesterNameCodeMapper = {
  [key: string]: string;
};

/*
Functionality
1. In same year two same semester cannot be created || setting name as unique true will not solve the issue cz next year Autumn semester will be offered once again
2. for three diff semster id will start from 0001 || 2030 Autumn 4 digit code -> 2030 01 0001 | 2030 Summer 4 digit code -> 2030 02 0001 | 2030 Fall 4 digit code -> 2030 03 0001
3. If semester and year change than from default it will add 1 iee 0000 default 0001
*/
