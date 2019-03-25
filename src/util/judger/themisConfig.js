const fs = require("fs");
const xml2js = require("xml2js");

/**
 * Decode to an xml file
 */
function decode(s) {
    let dec = zlib.inflateSync(s);
    let res = dec.toString("utf8");
    return res;
}

/**
 * Time to evaluate each task
 * @param {String} Address of the file 
 * @returns {Array} time  
 */

function callTimeLimit(Address) {
    var fn = fs.readFileSync(Address);
    var xml = decode(fn);
    var parseString = xml2js.parseString;
    var Task = [];

    parseString(xml, (err, result) => {
        if (err) {
            throw new err;
        }
        const Exam = result.Tasks.Exam;
        // an array contains information of each task 
        for (let i = 0; i < Exam.length; i++) {
            let StandardLimit = parseInt(Exam[i].$.TimeLimit);
            // the standard time limit of this task
            let time = 0;
            const TestCases = Exam[i].TestCase;
            // an array contains information of each test in this task
            for (let j = 0; j < TestCases.length; j++) {
                if (TestCases[j].$.Timelimit == '-1') {
                    // '-1' means the time limit of this test is equal to the Standard
                    time += parseInt(StandardLimit);
                }
                else time += parseInt(TestCases[j].$.Timelimit);
            }
            Task[i] = time; //resign the value
        }
    });
    return Task;
}

module.exports = { callTimeLimit };