const { error } = require('console');
const CarsModel = require('../models/Cars');
const asyncHandler = require('express-async-handler');

class Cars {
    add = asyncHandler(async (req, res) => {
        const { year, title } = req.body;
        const { id } = req.user;

        if (!year || !title) {
            res.status(400);
            throw new Error(`Provide all fields`);
        }

        const car = await CarsModel.create({ ...req.body, owner: id });
        res.status(201).json({ code: 201, data: car });
    });

    getAll = asyncHandler(async (req, res) => {
        const { id } = req.user;
        const cars = await CarsModel.find({ owner: id }).populate(
            'owner',
            'email'
        );
        res.status(200).json({ code: 200, data: cars, qty: cars.length });
    });

    getOne = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const car = await CarsModel.findById(id);
        res.status(200).json({ code: 200, data: car });
    });

    update = (req, res) => {
        res.send('update');
    };

    remove = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const car = await CarsModel.findByIdAndRemove(id);
        res.status(200).json({ code: 200, data: car });
    });
}

module.exports = new Cars();
