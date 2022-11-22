const express = require('express')
const app = express()
const cookieParser = require("cookie-parser");
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const {cookieAuth} = require("./authentication")
const {userExist, checkIfNew, addTodo, addFlashcard, logout, checkValidEmail, getQuote} = require("./functions")
//const basicAuth = require('express-basic-auth');

const PORT = process.env.PORT || 5000

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

app.use(bodyParser.json({extended:true}));

app.use(cookieParser("82e4e438a0705fabf61f9854e3b575af"))

//const auth = basicAuth({
//    authorizer: authenticator
//});

//mongoose.connect("mongodb://localhost/testdb", () => { //connecting to local mongoDB
//    console.log("monogo connected")
//},
//(error) => {
//    console.log(error)
//})


mongoose.connect("", { //connecting to mongodb atlas
    useNewUrlParser:true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("mongodb Connected")
})
.catch((error) => {
    console.log(error)
})


app.post("/login", (req, res) => {
    userExist(req, res,req.body.Form.email)
})

app.post("/signup", (req, res) => {
    checkValidEmail(req,res,req.body.Form.email)
    //checkIfNew(req,res)//checks if the user being created is new based on the email provided
})

app.post("/todos", cookieAuth , (req, res) => { //PUT method makes more sense here
    addTodo(req,res) //updates todos and goals
})

app.post("/flashcards", cookieAuth , (req, res) => {
    addFlashcard(req,res) //adds a flashcard set to db
})

app.post("/logout", cookieAuth, (req, res) => { //update db and logout user
    logout(req,res)
})

app.post('/quote', cookieAuth, (req,res) => {
    getQuote(req,res);
})

app.listen(PORT, (req, res) => {
    console.log(`server started on port ${PORT}`);
})



