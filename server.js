const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require('./middleWare/errorMiddleware');
const cookieParser = require('cookie-parser');
const path = require("path");


const app = express();

const PORT = process.env.PORT || 5000;

//Middlewares

app.use(express.json())// to handle json data in application
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json()) // convert the data to object to easily access in backend
app.use(cors({
    origin: ["http://localhost:3000","https://inventory-app.vercel.app"],
    credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname,"uploads")))

// Routes Middleware

app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/contactus', contactRoute);

//Routes

app.get("/",(req,res)=>{
    res.send("Inventory Management Home page");
})

// Error Middleware

app.use(errorHandler)

//Connect to Mongo DB

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT, ()=> {
         console.log(`Server running on PORT: ${PORT}`)
    })
}).catch((err)=>{
    console.log(err);
})