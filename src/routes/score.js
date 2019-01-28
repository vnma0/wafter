const express = require("express");

const auth = require("../middleware/auth");
const scoreboard = require("../util/scoreboard");

const router = express.Router();

router.get("/", auth, (req, res) => {
    scoreboard(req.user._id).then(
        (result) => res.send(result),
        () => res.sendStatus(500)
    );
});

module.exports = router;
