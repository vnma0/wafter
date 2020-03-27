function getBriefVerdict(tests) {
    let verdict = "AC";
    if (tests)
        tests.some(c => {
            if (c.verdict !== "AC") {
                verdict = c.verdict;
                return true;
            }
        });
    else verdict = "CE";

    return verdict;
}

module.exports = { getBriefVerdict };
