import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { Request } from 'express';
import s3Client from './s3.config';
import dotenv from 'dotenv';

dotenv.config();

const storage = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME as string,
    metadata: function (req: Request, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

export const upload = multer({ storage });
