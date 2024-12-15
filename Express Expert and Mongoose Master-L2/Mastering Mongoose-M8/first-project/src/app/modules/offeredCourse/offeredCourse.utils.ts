//@ts-ignore
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`); // 10:30
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`); // 12:30
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`); // 9:30
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`); // 11:30
    /*
        10:30 - 12:30 
        9:30 - 11:30 
    */
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  // forEach will not give proper outcome as it continues to run || forEach e break kaaj kore na so used for of loop
  //   assignedSchedules.forEach((schedule) => {
  //     const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`); // 10:30
  //     const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`); // 12:30
  //     const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`); // 9:30
  //     const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`); // 11:30
  //     /*
  //         10:30 - 12:30
  //         9:30 - 11:30
  //     */
  //     if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
  //       return true;
  //     }
  //   });
  return false;
};
