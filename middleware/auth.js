/**
 * Check if connected session is authenticated
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function auth(req, res, next) {
    if (req.isAuthenticated()) return next();
    else res.sendStatus(401);
}
