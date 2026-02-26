"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./src/routes/index"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 1234;
// database name
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("error", console.error.bind({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
//important
app.use("/", index_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../dist")));
if (process.env.NODE_ENV === 'development') {
    const corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    };
    app.use((0, cors_1.default)(corsOptions));
}
else if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.resolve('../..', 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve('../..', 'build', 'index.html'));
    });
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=app.js.map