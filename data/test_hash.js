import bcrypt from "bcrypt-nodejs";

let str = "absacas";

let strhash = bcrypt.hashSync(str);

console.log(strhash);