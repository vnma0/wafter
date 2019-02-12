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

export { isUsername };
