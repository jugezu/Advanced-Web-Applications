"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
// I hope I remember to remove the commented code when this is ready.
const registerValidation = [
    (0, express_validator_1.body)("email").trim().escape().isEmail(),
    (0, express_validator_1.body)("password").isLength({ min: 4 }).matches(/[A-Z]/).withMessage("Must contain uppercase letter") //uppercase letter
    //.matches(/[a-z]/).withMessage("Must contain lowercase letter") //lower case letter
    //.matches(/[0-9]/).withMessage("Must contain number") // number 
    //.matches(/[#!&?]/).withMessage("Must contain special character") // special characters
];
exports.registerValidation = registerValidation;
const loginValidation = [
    (0, express_validator_1.body)("email").trim().escape().isEmail(),
    (0, express_validator_1.body)("password")
];
exports.loginValidation = loginValidation;
//# sourceMappingURL=inputValidation.js.map