// Cannot GET /api/v1/cars
const carsController = require('../controllers/Cars');
const authMDW = require('../middlewares/authMDW');
const rolesMDW = require('../middlewares/rolesMDW');

const carsRoutes = require('express').Router();

carsRoutes.post(
    '/cars',
    (req, res, next) => {
        console.log('joi');
        next();
    },
    authMDW,
    carsController.add
);
// ["ADMIN", "MODERATOR", "USER", "CTO"]
carsRoutes.get(
    '/cars',
    authMDW,
    // rolesMDW(['ADMIN', 'MODERATOR']),
    carsController.getAll
);
carsRoutes.get('/cars/:id', carsController.getOne);
carsRoutes.put('/cars/:id', carsController.update);
carsRoutes.delete('/cars/:id', carsController.remove);

module.exports = carsRoutes;
