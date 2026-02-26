import {body} from "express-validator"

// I hope I remember to remove the commented code when this is ready.
const registerValidation = [
    body("email").trim().escape().isEmail(),
                                                         
    body("password").isLength({min: 4}).matches(/[A-Z]/).withMessage("Must contain uppercase letter")  //uppercase letter
    //.matches(/[a-z]/).withMessage("Must contain lowercase letter") //lower case letter
    //.matches(/[0-9]/).withMessage("Must contain number") // number 
    //.matches(/[#!&?]/).withMessage("Must contain special character") // special characters

]

const loginValidation= [
    body("email").trim().escape().isEmail(),
    body("password")
]

export {registerValidation,loginValidation}