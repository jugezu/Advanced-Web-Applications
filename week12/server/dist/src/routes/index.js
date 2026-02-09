"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Books_1 = require("../models/Books");
const router = (0, express_1.Router)();
router.post("/api/book/", async (req, res) => {
    try {
        const { author, name, pages } = req.body;
        let book = await Books_1.Books.findOne({ name });
        if (!book) {
            book = new Books_1.Books({
                name,
                author,
                pages
            });
            await book.save();
            return res.status(200).json({ message: `ok` });
        }
        else {
            return res.status(400).json({ message: `Book '${name}' already exists.` });
        }
    }
    catch (error) {
        console.error(`${error}`);
    }
});
router.get("/api/book/:name", async (req, res) => {
    try {
        const bookName = req.params.name;
        //find book with same name
        const book = await Books_1.Books.findOne({ name: bookName });
        if (!book) {
            return res.status(404).json({ message: ': This is not the webpage you are looking for' });
        }
        return res.status(200).json(book);
    }
    catch (error) {
        console.error(`${error}`);
        return res.status(500);
    }
});
exports.default = router;
