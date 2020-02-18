const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
const dotenv = require("dotenv").config();
const helmet = require('helmet');
const morgan = require('morgan');

const PORT = process.env.PORT || 4000;

const db = {
    name: process.env.DB_NAME,
    cluster: process.env.DB_CLUSTER,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
}

const dburi = `mongodb+srv://${db.user}:${db.password}@${db.cluster}.mongodb.net/${db.name}?retryWrites=true&w=majority`;

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB connection established successfully ("+ db.name +")");
})

app.use(express.static(path.join(__dirname, "frontend", "build")));
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'));


const collectionItemRoutes = require('./backend/routes/collectionitem.routes');
app.use('/api/v1/collectionitems', collectionItemRoutes);

const userRoutes = require('./backend/routes/user.routes');
app.use('/api/v1/users', userRoutes);


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(PORT, function() {
    console.log("Server is running (Port " + PORT + ")");
});