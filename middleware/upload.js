import multer from "multer";
import { isBinaryFileSync } from "isbinaryfile";
import { extname, basename } from "path";

import code from "../config/code";
import contest from "../config/contest";

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
const codeUpload = limitUpload(
    multer({
        dest: code.uploadFolder,
        limits: {
            fileSize: code.sizeLimit,
            files: 1,
            parts: 1
        }
    }).single("code")
);

/**
 * Check if given file is a valid source code by check if it's binary or not
 * @param {Object} file source code blob
 */
function checkCodeType(file) {
    return !isBinaryFileSync(file.path);
}

/**
 * Check if given file is written in correct extension and problem id
 * @param {Object} file
 */
function isCorrectFile(file) {
    const name = file.originalname.toUpperCase();
    const ext = extname(name);
    const prob_id = basename(name, ext);

    const isAllowedExt = contest.allowedCodeExt.includes(ext);
    const isAllowedProbId = contest.probList.includes(prob_id);

    return isAllowedExt && isAllowedProbId;
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
function validateCode(req, res, next) {
    const code = req.file;
    // Check for invalid code
    if (!code) res.sendStatus(400);
    else {
        if (checkCodeType(code) && isCorrectFile(code)) next();
        else res.sendStatus(415);
    }
}

export default [codeUpload, validateCode];
