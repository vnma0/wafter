"use strict";

const ExpressBruteFlexible = require("rate-limiter-flexible/lib/ExpressBruteFlexible");

const bruteforce = new ExpressBruteFlexible(
    ExpressBruteFlexible.LIMITER_TYPES.MEMORY
);

module.exports = bruteforce;
