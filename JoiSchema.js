const Joi = require('joi');

module.exports.grocerySchema = Joi.object({
    name: Joi.string()
        .required(),

    quantity: Joi.number()
        .required().min(0),
});