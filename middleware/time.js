import server from "../config/server";

/**
 * Check if connected session is authenticated
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function contestIsRunning(req, res, next) {
    const { startTime, endTime } = server.contest;
    const now = new Date();
    if (now < startTime || now > endTime) res.sendStatus(403);
    else next();
}
