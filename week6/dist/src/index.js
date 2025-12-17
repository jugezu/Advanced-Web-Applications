"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Offer_1 = __importDefault(require("./models/Offer"));
const Image_1 = require("./models/Image");
const multer_config_1 = __importDefault(require("./middleware/multer-config"));
const router = (0, express_1.Router)();
// POST /upload
router.post("/upload", multer_config_1.default.single("image"), async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const filename = req.file?.filename;
        const filepath = `images/${filename}`;
        //save image to mongoDB
        const newImage = new Image_1.Image({
            filename,
            path: filepath,
        });
        await newImage.save();
        const offer = new Offer_1.default({
            title,
            description,
            price,
            imageId: newImage._id || null
        });
        await offer.save();
        res.json({ message: `Offer added successfully ${offer} ${newImage}` });
    }
    catch (error) {
        console.error(`${error}`);
    }
});
// GET /offers 
router.get("/offers", async (req, res) => {
    try {
        const offers = await Offer_1.default.find();
        //Found help using promise in this website: https://10xdev.blog/promise-all-map-async-await-example/
        const result = await Promise.all(offers.map(async (offer) => {
            const image = await Image_1.Image.findById(offer.imageId);
            return {
                title: offer.title,
                description: offer.description,
                price: offer.price,
                imagePath: image ? image.path : null
            };
        }));
        if (!offers) {
            return res.status(404).json({ message: "offers not found" });
        }
        return res.json(result);
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }
});
exports.default = router;
