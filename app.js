require('dotenv').config()
const express = require('express');
const rateLimit = require('express-rate-limit')
const { check, validationResult } = require('express-validator');

// express app
const app = express();
const port = process.env.PORT || 3000;

app.listen(port);
app.use(express.urlencoded({ extended: true }));


const limiter = rateLimit({
	windowMs: 1000, // 1 second
	max: 3, // Limit each IP to 3 requests per `window` (here, per second)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.get("/howold",  
    check('dob').not().isEmpty().withMessage('Date of Birth is Required').isDate().withMessage('Invalid Date Format'), 
    (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const age = req.query.dob

    function getAge(dateString) {
        var ageInMilliseconds = new Date() - new Date(dateString);
        return Math.floor(ageInMilliseconds/1000/60/60/24/365); // convert to years
     }

    res.status(200).json({ age: getAge(age) })
})




