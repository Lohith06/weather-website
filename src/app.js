const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Lohith C",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Lohith C",
    message:
      "I am a Full Stack Developer working in Tata Consultancy Services.",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "Please contact - lohithlohi1895@gmail.com for any help",
    title: "Help",
    name: "Lohith C",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Lohith C",
    errorMessage: "Help artical not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Lohith C",
    errorMessage: "Page not found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
