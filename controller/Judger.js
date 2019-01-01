import Judger from "../driver/kon";
// TODO: Make Judgers singleton
export const Judgers = ["http://localhost:30000"].map(
    (host) => new Judger(host)
);
