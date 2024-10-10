// Here is where we import modules
// We begin by loading Express
const express = require("express");
const app = express();
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const methodOverride = require("method-override");
const morgan = require("morgan");

const mongoose = require("mongoose"); // require package

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
  
const Fruit = require("./models/fruit.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new


// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });
  

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs");
  });

  //We’ll use Mongoose’s .findById() method for fetching a specific fruit by its _id. This method is perfect for retrieving a single document based on its unique identifier.
  app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", { fruit: foundFruit });
  });
  

  // GET /fruits index route using find method
  //app.get("/fruits", async (req, res) => {
    //const allFruits = await Fruit.find();
    //console.log(allFruits); // log the fruits!
    //res.send("Welcome to the index page!");
 // });
  
 app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find();
    res.render("fruits/index.ejs", { fruits: allFruits });
  });
  
  

// POST /fruits
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect("/fruits"); // redirect to index fruits
  });


  app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
  });
  
  
// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  //console.log(foundFruit);
  //res.send(`This is the edit route for ${foundFruit.name}`);
//});
res.render("fruits/edit.ejs", {
  fruit: foundFruit,
});
});

// server.js

app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});



app.listen(3000, () => {
  console.log("Listening on port 3000");
});

