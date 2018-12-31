import { Judgers } from "./Judger";
import { updateSubmission } from "../data/database";

/**
 * Update submission status
 * @param {function} calc Calculate result, either ACM or OI
 */
export function reloadSubs(calc) {
    const judgerPromise = Judgers.map((judger) => judger.get());
    Promise.all(judgerPromise)
        .then((list) => [].concat.apply([], list))
        .then((subs) => {
            subs.forEach((sub) => {
                updateSubmission(sub.id, calc(sub));
            });
        })
        .catch(console.log);
}
