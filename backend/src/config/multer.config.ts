import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs';
import { logger } from '@/utils/logMiddlewares';

const uploadPath = path.join(__dirname, '../../uploads');
logger.info(uploadPath);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req: Request, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage });
