"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const registerValidation = [
    (0, express_validator_1.body)("email").trim().escape().isEmail(),
    (0, express_validator_1.body)("username").trim().escape().isLength({ min: 3, max: 25 }),
    //uppercase,   lowercase,        number            special characters
    (0, express_validator_1.body)("password").isLength({ min: 8 }).matches(/[A-Z]/).withMessage("Must contain uppercase letter")
        .matches(/[a-z]/).withMessage("Must contain lowercase letter")
        .matches(/[0-9]/).withMessage("Must contain number")
        .matches(/[#!&?]/).withMessage("Must contain special character")
];
exports.registerValidation = registerValidation;
const loginValidation = [
    (0, express_validator_1.body)("email").trim().escape().isEmail(),
    (0, express_validator_1.body)("password")
];
exports.loginValidation = loginValidation;
