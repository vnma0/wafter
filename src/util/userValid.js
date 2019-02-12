import { TextEncoder } from "util";

/**
 * Validate username
 * @param {String} username User's name
 */
function isUsername(username) {
    if (username.length > 18 || username.length < 3) return false;
    for (let i = 0; i < username.length; i++) {
        let c = username[i];
        if (
            !(
                ("0" <= c && c <= "9") ||
                ("a" <= c && c <= "z") ||
                ("A" <= c && c <= "Z") ||
                c == "_" ||
                c == "-"
            )
        )
            return false;
    }
    return true;
}

/**
 * Validate Password
 * This is required due to the limitation of bcrypt
 * @param {String} password
 */
function isPassword(password) {
    const lowerLimit = password.length >= 6;
    const upperLimit = TextEncoder().encode(password).length <= 72;
    return upperLimit && lowerLimit;
}

export { isUsername, isPassword };
