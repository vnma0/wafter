import multer from "multer";
import { cwd } from "../config/cwd";
import { join } from "path";
import { codeSizeLimit, acceptMIME } from "../config/code";

/**
 * Multer middleware wrapper to limit upload size
 * If payload is too large, send status 413
 * If there's other error, send status 400
 * Else, next()
 * @param {Multer} multerMid multer middleware
 * @returns {Middleware} wrapped middleware
 */
function limitUpload(multerMid) {
    return (req, res, next) => {
        multerMid(req, res, (err) => {
            const isMulterLimit =
                err instanceof multer.MulterError &&
                err.code === "LIMIT_FILE_SIZE";
            if (isMulterLimit) {
                res.sendStatus(413);
            } else if (err) {
                res.sendStatus(400);
            } else next();
        });
    };
}

/**
 * receive task from Wafter
 * If payload is too large, send status 413
 * If there's other error, send status 400
 * Else, next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export const codeUpload = limitUpload(
    multer({
        dest: join(cwd, "upload/"),
        limits: {
            fileSize: codeSizeLimit,
            files: 1,
            parts: 1,
            preservePath: true
        }
    }).single("code")
);

/**
 * Check if given file is a valid source code via MIME
 * @param {Object} file source code blob
 */
function checkCodeType(file) {
    return acceptMIME.includes(file.mimetype);
}

/**
 * Check if recieved file is a valid source code
 * If the received file is empty, send status 400
 * Else if file's type is incorrect, send status 415
 * Else call next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function validateCode(req, res, next) {
    const code = req.file;
    // Check for invalid code
    if (!code) res.sendStatus(400);
    else {
        if (!checkCodeType(code)) res.sendStatus(415);
        else next();
    }
}
