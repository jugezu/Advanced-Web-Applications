"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
//used in  POST /user
let users = [];
//GET /hello 
router.get("/hello", (req, res) => {
    try {
        res.json({ msg: "Hello world!" });
    }
    catch (error) {
        console.error(`Error parsing JSON: ${error}`);
    }
});
// GET /echo/:id
router.get("/echo/:id", (req, res) => {
    let id = req.params.id;
    try {
        res.json({ id });
    }
    catch (error) {
        console.error(`Error parsing JSON: ${error}`);
    }
});
// POST /sum 
router.post("/sum", (req, res) => {
    let { numbers } = req.body;
    let result = 0;
    //summarize numbers and sen the result back
    try {
        numbers.forEach((i) => {
            result = result + i;
        });
        res.json({ sum: result });
    }
    catch (error) {
        console.error(`Error parsing JSON: ${error}`);
    }
});
// POST /users
router.post("/users", (req, res) => {
    try {
        const { name, email } = req.body;
        const addUser = { name, email };
        users.push(addUser);
        res.json({ message: "user successfully added" });
    }
    catch (error) {
        console.error(`Error parsing JSON: ${error}`);
    }
});
// GET /users  
// returns users 
router.get("/users", (req, res) => {
    try {
        res.status(201).json({ users });
    }
    catch (error) {
        console.error(`${error}`);
    }
});
exports.default = router;
