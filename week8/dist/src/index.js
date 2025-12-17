"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("./models/User");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validateToken_1 = require("./middleware/validateToken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
// POST /api/user/register
router.post("/api/user/register", (0, express_validator_1.body)("email").trim().isLength({ min: 3 }).escape(), (0, express_validator_1.body)("password").isLength({ min: 3 }), async (req, res) => {
    //checking error
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return (res.status(400).json({ error: errors.array() }));
    }
    try {
        //finding if user exists already
        const user = await User_1.User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            // 403 = forbidden
            return res.status(403).json({ email: "email already in use" });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        /*const newUser: IUser={
            email: req.body.email,
            password: hash
        }*/
        const newUser = await User_1.User.create({
            email: req.body.email,
            password: hash
        });
        return res.status(200).json(newUser);
    }
    catch (error) {
        console.error(`${error}`);
    }
});
// GET /api/user/list
router.get("/api/user/list", async (req, res) => {
    try {
        const users = await User_1.User.find();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(`Error while fecthing users ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// POST /api/user/login
router.post("/api/user/login", (0, express_validator_1.body)("email").trim().escape(), (0, express_validator_1.body)("password").escape(), async (req, res) => {
    try {
        const user = await User_1.User.findOne({ email: req.body.email });
        //const user = users.find(user => user.email ===req.body.email)
        //console.log(user)
        if (!user) {
            return res.status(401).json({ message: "Login failed" });
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            const jwtPayload = {
                //id: user._id,
                email: user.email
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "2m" });
            return res.status(200).json({ success: true, token });
        }
        return res.status(401).json({ message: "Login failed" });
    }
    catch (error) {
        console.error(`Error during user login ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// GET /api/private
router.get("/api/private", validateToken_1.validateToken, async (req, res) => {
    return res.status(200).json({ message: "This is protected secure route!" });
});
exports.default = router;
