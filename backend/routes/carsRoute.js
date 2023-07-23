// Cannot GET /api/v1/cars
const carsController = require('../controllers/Cars');

const carsRoutes = require('express').Router();

carsRoutes.post(
  '/cars',
  (req, res, next) => {
    console.log('joi');
    next();
  },
  carsController.add
);
carsRoutes.get('/cars', carsController.getAll);
carsRoutes.get('/cars/:id', carsController.getOne);
carsRoutes.put('/cars/:id', carsController.update);
carsRoutes.delete('/cars/:id', carsController.remove);

module.exports = carsRoutes;

//Додати машину
//Отримати всі машини
//Отримати одну
//Обновити
//Видалити
