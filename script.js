const express = require("express");
const res = require("express/lib/response");
const app = express();
const winston = require("winston")
const port = 3040;

const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { findUserByUsername } = require('./user-service');

// Validation

// Checks for inputs
const checkInputs = (n1, n2) => {
    if(n1 === undefined){
        logger.error("n1 cannot be blank");
        throw new Error("n1 cannot be blank");
    }
    if(n2 === undefined){
        logger.error("n2 cannot be blank");
        throw new Error("n2 cannot be blank");
    }
}
const checkInput = (n1) => {
    if(n1 === undefined){
        logger.error("n1 cannot be blank");
        throw new Error("n1 cannot be blank");
    }
}

// Validates inputs as numbers
const verifyNumbers = (n1, n2) => {

    if(isNaN(n1)){
        logger.error("n1 is needs to be a number");
        throw new Error("n1 needs to be a number");
    }
    if(isNaN(n2)){
        logger.error("n2 is needs to be a number");
        throw new Error("n2 needs to be a number");
    }
}
const verifyNumber = (n1) => {
    if(isNaN(n1)){
        logger.error("n1 is needs to be a number");
        throw new Error("n1 needs to be a number");
    }
}

// Calculator maths functions
const add = (n1, n2) => {
    return n1+n2;
}
const subtract = (n1, n2) => {
    return n1-n2;
}
const multiply = (n1, n2) => {
    return n1*n2;
}
const divide = (n1, n2) => {
    return n1/n2;
}
const square = (n1) => {
    return n1 ** 2
}
const root = (n1) => {
    return n1 ** 0.5
}

// Winston logging 
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-service'},
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log'})
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    }));
}

// Authentication

app.use(passport.initialize());

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
};

// Authenticates user
passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    const user = findUserByUsername(jwt_payload.username);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'User not found' });
    }
}));

// Calculator endpoints

// Generate token endpoint generates a token for a valid user
// Example command to make the app work
// http://localhost:3040/generate-token?username=Rikky
app.get("/generate-token", (req, res) => {

    try {
        // Validates username
        if(findUserByUsername(req.query.username) === null){
            throw new Error("no user found");
        }
    
        const token = jwt.sign({ username: req.query.username}, 'secret');
        res.json({ token })

    } catch (error) {
        console.error(error)
        res.status(500).json({statuscode: 500, msg: error.toString() })
    }
})

// Add endpoint adds 2 numbers
// Example command to make the app work
// http://localhost:3040/add?n1=1&n2=3
app.get("/add", passport.authenticate('jwt', { session: false }), (req,res) => {
    try {
        logger.info('Parameters '+req.query.n1+' and '+req.query.n2+' received for addition');

        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);

        checkInputs(req.query.n1, req.query.n2)
        verifyNumbers(n1, n2)

        const result = add(n1,n2);
        res.status(200).json({statuscode:200, data: result});

    } catch (error) {
        console.error(error)
        res.status(500).json({statuscode: 500, msg: error.toString() })
    } 
});

// Subtract endpoint subtracts the second number from the first
// Example command to make the app work
// http://localhost:3040/subtract?n1=1&n2=3
app.get("/subtract", passport.authenticate('jwt', { session: false }), (req,res) => {
    try {
        logger.info('Parameters '+req.query.n1+' and '+req.query.n2+' received for subtraction');
        
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);

        checkInputs(req.query.n1, req.query.n2)
        verifyNumbers(n1, n2)

        const result = subtract(n1,n2);
        res.status(200).json({statuscode:200, data: result});

    } catch (error) {
        console.error(error)
        res.status(500).json({statuscode: 500, msg: error.toString() })
    } 
});

// Multiply endpoint multiplies 2 numbers
// Example command to make the app work
// http://localhost:3040/multiply?n1=1&n2=3
app.get("/multiply", passport.authenticate('jwt', { session: false }), (req,res) => {
    try {
        logger.info('Parameters '+req.query.n1+' and '+req.query.n2+' received for multiplication');

        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);

        checkInputs(req.query.n1, req.query.n2)
        verifyNumbers(n1, n2)

        const result = multiply(n1,n2);
        res.status(200).json({statuscode:200, data: result});

    } catch (error) {
        console.error(error)
        res.status(500).json({statuscode: 500, msg: error.toString() })
    } 
});

// Divide endpoint divides the first number by the second
// Example command to make the app work
// http://localhost:3040/divide?n1=1&n2=3
app.get("/divide", passport.authenticate('jwt', { session: false }), (req,res) => {
    try {
        logger.info('Parameters '+req.query.n1+' and '+req.query.n2+' received for division');

        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        
        checkInputs(req.query.n1, req.query.n2)
        verifyNumbers(n1, n2)

        if(n2 == 0){
            logger.error("n2 cannot be 0");
            throw new Error("n2 cannot be 0");
        }

        const result = divide(n1,n2);
        res.status(200).json({statuscode:200, data: result});

    } catch (error) {
        console.error(error)
        res.status(500).json({statuscode: 500, msg: error.toString() })
    } 
});

// Square endpoint squares a number
// Example command to make the app work
// http://localhost:3040/square?n1=3
app.get("/square", passport.authenticate('jwt', { session: false }), (req,res) => {
    try {
        logger.info('Parameter '+req.query.n1+' received for squaring');
        
        const n1 = parseFloat(req.query.n1);

        checkInput(req.query.n1)
        verifyNumber(n1)

        const result = square(n1);
        res.status(200).json({statuscode:200, data: result});

    } catch (error) {
        console.error(error)
        res.status(500).json({statuscode: 500, msg: error.toString() })
    } 
});

// Root endpoint finds the square root of a number
// Example command to make the app work
// http://localhost:3040/root?n1=25
app.get("/root", passport.authenticate('jwt', { session: false }), (req,res) => {
    try {
        logger.info('Parameter '+req.query.n1+' received for rooting');

        const n1 = parseFloat(req.query.n1);

        checkInput(req.query.n1)
        verifyNumber(n1)

        if(n1 < 0){
            logger.error("n2 cannot be negative");
            throw new Error("n2 cannot be negative");
        }

        const result = root(n1);
        res.status(200).json({statuscode:200, data: result});

    } catch (error) {
        console.error(error)
        res.status(500).json({statuscode: 500, msg: error.toString() })
    } 
});

// Start the server

app.listen(port, () => {
    console.log("hello i'm listening to port " + port);
})


