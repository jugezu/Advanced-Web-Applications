import {body} from "express-validator"

const registerValidation = [
    body("email").trim().escape().isEmail(),
    
    body("username").trim().escape().isLength({min: 3, max:25}),
                                            //uppercase,   lowercase,        number            special characters
    body("password").isLength({min: 8}).matches(/[A-Z]/).withMessage("Must contain uppercase letter")
    .matches(/[a-z]/).withMessage("Must contain lowercase letter")
    .matches(/[0-9]/).withMessage("Must contain number")
    .matches(/[#!&?]/).withMessage("Must contain special character")

]

const loginValidation= [
    body("email").trim().escape().isEmail(),
    body("password")
]

export {registerValidation,loginValidation}