import { HydratedDocument, Model } from 'mongoose';

export interface ITour {
  name: string;
  durationHours: number;
  averageRating: number;
  price: number;
  coverImage: string;
  images: string[];
  startDates: Date[];
  startLocation: string;
  locations: string[];
  slug: string;
}
export interface ITourMethods {
  getNextNearestStartDateAndEndData(): {
    nearestStartDate: Date | null;
    estimatedEndDate: Date | null;
  };
}

interface TTourModel
  extends Model<ITour, Record<string, unknown>, ITourMethods> {// here Record<string, unknown> means { } empty obj
  startDates: Date[];
  durationHours: number;
  getNextNearestStartDateAndEndData(): Promise<
    HydratedDocument<ITour, ITourMethods>
  >;
}

export default TTourModel;
