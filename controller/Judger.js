import Judger from "../driver/kon";
export const Judgers = ["http://localhost:30000"].map(
    (host) => new Judger(host)
);
