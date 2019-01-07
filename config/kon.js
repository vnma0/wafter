import Judger from "../driver/kon";
import { readFileSync } from "fs";

const serverList = readFileSync(".konlist", "utf8");

export default {
    judgers: serverList.split("\r\n").map((kon) => new Judger(kon))
};
