import { Router } from 'express';
import { tourController } from './tour.controller';

const tourRouter = Router();

tourRouter.get('/schedule/:id', tourController.getNextSchedule)
tourRouter.get('/:id', tourController.getSingleTour);// best practise to declare dynamic route in first bz sometimes it does not to dynamic route instead goes to get all route
tourRouter.get('/', tourController.getTours);
tourRouter.post('/create-tour', tourController.createTour);
tourRouter.put('/:id', tourController.updateTour);
tourRouter.delete('/:id', tourController.deleteTour);

export default tourRouter;
