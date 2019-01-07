// TODO: Add more configuration options
// TODO: Import from .env
export default {
    displayName: "Wafter - Themis Distributed Server",
    port: 3000,
    secret: process.env.SECRET || "UUIDGoesHere",
    contest: {
        // Change this to config contest time
        startTime: new Date(1970, 0, 1, 0, 0),
        endTime: new Date(1970, 0, 1, 1, 0)
    }
};
