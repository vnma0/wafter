"use strict";

const multer = require("multer");
const { isBinaryFile } = require("isbinaryfile");
const { extname, basename } = require("path");

const code = require("../config/code");
const contest = require("../config/contest");

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
async function isAllowedFileType(file) {
    return !(await isBinaryFile(file.path));
}

/**
 * Check if given file is written in correct extension and problem id
 * @param {Object} file
 */
function isCorrectFile(file) {
    const name = file.originalname.toUpperCase();
    const ext = extname(name);
    const prob_id = basename(name, ext);

    const isAllowedExt = contest.allowedCodeExt.indexOf(ext) > -1;
    const isAllowedProbId = contest.probList.indexOf(prob_id) > -1;

    return isAllowedExt && isAllowedProbId;
}

/**
 * Check if received file is a valid source code
 * If the received file is empty, send status 400
 * Else if file's type is incorrect, send status 415
 * Else call next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
async function validateCode(req, res, next) {
    const code = req.file;
    // Check for invalid code
    if (!code) res.sendStatus(400);
    else {
        if ((await isAllowedFileType(code)) && isCorrectFile(code)) next();
        else res.sendStatus(415);
    }
}

module.exports = [codeUpload, validateCode];
