"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const s3_config_1 = __importDefault(require("./s3.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const storage = (0, multer_s3_1.default)({
    s3: s3_config_1.default,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname +
            '-' +
            uniqueSuffix +
            path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage });
//# sourceMappingURL=multer.config.js.map