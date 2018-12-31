import express from 'express';
import bodyParser from 'body-parser';
import { readSubmission } from "./data/database.js";
const router = express.Router();

router.use(bodyParser());

router.get("/",(req,res) => {
    let sub_id = req.body.sub_id;
    res.send(readSubmission(sub_id));
});

export {router as getres};