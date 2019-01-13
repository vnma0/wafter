/**
 * Limit accept file type
 * Google "MIME" for correct MIME string
 */
export const acceptMIME = [
    "text/x-c",
    "text/x-pascal",
    "text/x-java-source",
    "text/x-script.python"
    // More will be availaable
];

/**
 * Limit code size: ~ 10 KB
 * This will make sure server can easily handle code without many problems
 */
export const codeSizeLimit = 10000;
