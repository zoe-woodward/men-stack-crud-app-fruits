// models/fruit.js

const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    isReadyToEat: Boolean,
  });

  const Fruit = mongoose.model("Fruit", fruitSchema); // create model
  //There is a convention to use a capital letter for database model names, so name your model Fruit, as opposed to fruit.



module.exports = Fruit;

