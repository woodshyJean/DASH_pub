const User = require("./schema/users") //importing model
const axios = require("axios").default;
const crypto = require('crypto');
const { sessionId, cookieAuth } = require("./authentication")
const sha256 = x => crypto.createHash('sha256').update(x, 'utf-8').digest('hex')// hash input with sha256

/////////////////////////////
async function userExist(req,res,clientEmail){ //checks whether a user exist
    const found = await User.find({email:`${clientEmail}`}) //looks for a user based on the recieved email
    try {
        if(found[0].password === sha256(req.body.Form.password)){ //if the returned database user password matches the client password
            let identifier = sessionId() //creates a uuid (univeraly unique identifier)
            User.updateOne({email: req.body.Form.email}, {$set: {updatedAt: Date.now()}}, (error, doc) =>{ //update the database with the current date
                if(error){
                    console.log(error)
                }
                console.log(doc)
            })
            User.updateOne({email: req.body.Form.email}, {$set: {id: identifier}}, (error, doc) =>{ //give the user a new uuid
                if(error){
                    console.log(error)
                }
                console.log(doc)
            })
            res.cookie('id', identifier, {signed: true}) //set a signed cookie with the uuid, this uuid will be used to make further request
            res.json({name:found[0].name, age:found[0].age , status:found[0].logedIn, todos:found[0].todos, goals:found[0].goals, sets:found[0].flashCardSets}) //send back specific user data
            res.status(200)
        }
        else{ //if the returned database user password does not match the client password
            
            res.sendStatus(401) //send back a unAuthorized status code
        }
    } catch (error) {
        console.log(error + "user does not exist")
    }
}




/////////////////////////////
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function checkValidEmail(req,res,clientEmail){ //check if the client email is valid through api

    let url = `https://emailvalidation.abstractapi.com/v1/?api_key=<API KEY>=${clientEmail}`;

      fetch(url)
        .then(res => res.json())
        .then(json => {
            
            console.log(json)
            if(json.deliverability === 'DELIVERABLE'){
                checkIfNew(req,res,clientEmail)
                res.sendStatus(200)
            }
            else{
                console.log("Invalid Email")
                res.sendStatus(401)
                return false;
            }
        
        })
        .catch(err => console.error('error:' + err));

}


async function getQuote(req,res){
    //console.log(req.body);
    let queries = req.body.queries.join(",");
    //console.log(queries)
    if(!queries) return
    ///let url = `https://quotable.io/quotes?query=inspirational&tags=${queries}`;
    let url = `https://quotable.io/quotes?tags=${queries}`;
    console.log(url)
    let response = res
      fetch(url)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            response.json({data:json})
        })
        .catch(err => console.error('error:' + err));

}


//////////////////////////////////////////////
async function checkIfNew(req,res,clientEmail){ //checks if a current user is trying to create another account with the same email / if the email used already exists in db
    const found = await User.exists({email:`${clientEmail}`}) //looks for database users with the recieved email
    try {
        if(found){ //if a user was found with the received email
            res.sendStatus(401) //send back a unAuthorized status code / dont create new user
        }
        else{ //if no user was found with the received email
            newUser(req,res) //start the create new user function
        }
    } 
    catch (error) {
        console.log(error.message)
    }
}




//////////////////////////////
async function newUser(req,res){ //create new user function
    try {
        const addNewUser = await User.create({ //mongoose user creation object
            //not sure if all the data needs to be hashed
            logedIn:false,
            name: req.body.Form.name,
            email: req.body.Form.email,
            password: sha256(req.body.Form.password), //saved hash version of password
            age: Number(req.body.Form.age),
            updatedAt: new Date(),
            todos: {
                "clickthe+toaddatodoorgoal":{
                    todo:"click the + to add a todo or goal",
                    dueDate: new Date(),
                    difficulty:"0",
                    priority:"high",
                    relatedGoal:"click the + to add a todo or goal",
                    active: true,
                }
            },
            goals: {
                "clickthe+toaddatodoorgoal":{
                goal:"click the + to add a todo or goal",
                goalDueDate: new Date(),
                goalPurpose:"add todos or goals",
                goalFail1:"i wont be able to track my todos or goals",
                goalFail2:"",
                goalFail3:"",
                relatedTodos:{
                    "clickthe+toaddatodoorgoal":{
                        todo:"click the + to add a todo or goal",
                        dueDate: new Date(),
                        difficulty:"0",
                        priority:"high",
                        relatedGoal:"click the + to add a todo or goal",
                        active: true,
                    }
                }
            }},
            flashCardSets:{
                testset:{
                    setName:"tutorial",
                    one:{
                        question:"what is 1 + 1 ?",
                        answer:"2",
                        type:"simple",
                    }
                }
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}



/////////////////////////////////
async function addTodo(req,res){
    try {
        const found = await User.find({id:`${req.signedCookies.id}`}) //use the id created at user login to find user
        if(found){
            console.log("found")
            let userTodos = req.body.data //todos
            let userGoals = req.body.goals //goals
            try {
                await User.findOneAndUpdate({id:`${req.signedCookies.id}`}, { todos: userTodos}, { //update todos
                    new:true
                });
                await User.findOneAndUpdate({id:`${req.signedCookies.id}`}, { goals: userGoals}, { //update goals
                    new:true
                });
            } catch (error) {
                console.log(error)   
            }
            res.sendStatus(200)
        }
        else{
            console.log("not found")
            res.sendStatus(401)
        }
    } catch (error) {
        console.log(error)
    }
}



///////////////////////////////////////
async function addFlashcard(req,res){
    try {
        const found = await User.find({id:`${req.signedCookies.id}`}) //find user with the cookiue
        if(found){
            console.log("found", req.body.sets)
            let userSets = req.body.sets
            try {
                await User.findOneAndUpdate({id:`${req.signedCookies.id}`}, { flashCardSets: userSets}, {
                    new:true
                });
            } catch (error) {
                console.log(error)   
            }
            res.sendStatus(200)
        }
        else{
            console.log("not found")
            res.sendStatus(401)
        }
    } catch (error) {
        console.log(error)
    }
}



//////////////////////////////////////////
async function logout(req,res){ //updates all user data on logout
    try {
        const found = await User.find({id:`${req.signedCookies.id}`})
        if(found){
            let todos = req.body.data
            let goals = req.body.goals
            let sets = req.body.sets
            await User.findOneAndUpdate({id:`${req.signedCookies.id}`}, { todos: todos}, {
                new:true
            });
            await User.findOneAndUpdate({id:`${req.signedCookies.id}`}, { goals: goals}, {
                new:true
            });
            await User.findOneAndUpdate({id:`${req.signedCookies.id}`}, { flashCardSets: sets}, {
                new:true
            });
            res.clearCookie('id');
        }
        else{
            console.log("not found")
            res.clearCookie('id');
        }
        res.end()
    } catch (error) {
        console.log(error)
    }
}



module.exports = {userExist, checkIfNew, addTodo, addFlashcard, logout, checkValidEmail, checkValidEmail, getQuote}
