// TODO: Add more configuration options
// TODO: Import from .env
export default {
    displayName: "Wafter - Themis Distributed Server",
    port: 3000,
    secret: process.env || "UUIDGoesHere",
    contest: {
        // Change this to config contest time
        startTime: new Date("1970", "01", "01", "00", "00", "00"),
        endTime: new Date("1970", "01", "01", "00", "00", "10")
    }
};
