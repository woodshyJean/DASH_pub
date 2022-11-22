const express = require('express')
const app = express()
const {v4: uuidv4} = require("uuid")
const cookieParser = require("cookie-parser");

app.use(cookieParser())

const sessionId = (req, res, next) => { // returns a unique uuid (universally unique indentifier)
    let id = uuidv4();
    return id
}

const cookieAuth = (req, res, next) => {
    if(!req.signedCookies.id) { //if the client doesnt have a signed cookie send 401
        res.sendStatus(401);
    } else {
        console.log(req.signedCookies)
        next();
    }
}

module.exports = { sessionId, cookieAuth  }










//const basicAuth = require("express-basic-auth");
//
//const sha256 = x => crypto.createHash('sha256').update(x, 'utf-8').digest('hex')

//const authenticator = (user, password) => {
//    if(!found[user] || !user || !password) return false;
//    return basicAuth.safeCompare(sha256(password), found[user].passwordHash);
//}
