const helpdeskRoutes = require('./routes/helpdeskRoutes')
require('dotenv').config();
const express = require('express');
const app=express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080
mongoose.connect(process.env.DATABASE_URL)
.then((res)=>{
    app.listen(PORT,()=>{
        console.log("Server is running on port 8080");
    })
})
.catch((error)=>{
    console.log(error.message);
})



app.use(express.json());

app.use((req,res,next)=>{
    console.log(req.path,req.method);
    next();
})

app.use('/helpdesk',helpdeskRoutes);