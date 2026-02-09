"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("./models/User");
const Topic_1 = require("./models/Topic");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validateToken_1 = require("./middleware/validateToken");
const dotenv_1 = __importDefault(require("dotenv"));
const inputValidation_1 = require("./validators/inputValidation");
dotenv_1.default.config();
const router = (0, express_1.Router)();
// POST /api/user/register
router.post("/api/user/register", inputValidation_1.registerValidation, async (req, res) => {
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
            // same email twice
            return res.status(403).json({ email: "Email already in use." });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        const newUser = await User_1.User.create({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            isAdmin: req.body.isAdmin
        });
        // if gc error remember to try res.json(newUser)
        return res.status(200).json(newUser);
    }
    catch (error) {
        console.error(`${error}`);
    }
});
// POST /api/user/login
router.post("/api/user/login", inputValidation_1.loginValidation, async (req, res) => {
    try {
        const user = await User_1.User.findOne({ email: req.body.email });
        //console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            const jwtPayload = {
                _id: user._id,
                username: user.username,
                isAdmin: user.isAdmin
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "20m" });
            return res.status(200).json({ success: true, token });
        }
        return res.status(401).json({ message: "Invalid password" });
    }
    catch (error) {
        console.error(`Error during user login ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// GET /api/topics
router.get("/api/topics", async (req, res) => {
    try {
        const topics = await Topic_1.Topic.find();
        return res.status(200).json(topics);
    }
    catch (error) {
        console.log(`Error while fecthing topics ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// POST /api/topic
router.post("/api/topic", validateToken_1.validateToken, async (req, res) => {
    try {
        const newTopic = await Topic_1.Topic.create({
            title: req.body.title,
            content: req.body.content,
            username: req.user?.username
        });
        return res.status(200).json(newTopic);
    }
    catch (error) {
        console.error(`Error while posting topic ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// DELETE /api/topic/:id
router.delete("/api/topic/:id", validateToken_1.validateToken, validateToken_1.validateAdmin, async (req, res) => {
    try {
        await Topic_1.Topic.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Topic deleted successfully." });
    }
    catch (error) {
        console.error(`Error while deleting topic ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
