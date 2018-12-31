import express from 'express';
import bodyParser from 'body-parser';
import { submitCode } from "./data/database.js";
const router = express.Router();

router.use(bodyParser());

router.post("/",(req,res) => {
    let source_code = req.body.source_code;
    let username = req.body.username;
    let problemID = req.body.problemID;
    submitCode(source_code,username,problemID);
    res.send("Submitted successfully");
})

export {router as submit};