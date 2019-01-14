import server from "../config/server";

/**
 * parseProbList
 * @param {Array} obj Array of problem included in kon.json
 */
function parseProbList(obj) {
    const probList = server.contest.probList;
    if (obj === undefined) return probList;

    if (!Array.isArray(obj) || !obj) return [];
    const out = obj.filter((x) => probList.includes(x));

    return out;
}

export default parseProbList;