import express from 'express';
import bodyParser from 'body-parser';
import { readUser } from "./data/database.js";
const router = express.Router();

router.use(bodyParser());

router.get("/",(req,res) => {
    let username = req.body.username;
    res.send(readUser(username));
})