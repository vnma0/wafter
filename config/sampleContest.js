let now = new Date();
let sampleStart = [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours() + 1
];
let sampleEnd = [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours() + 2
];

export default {
    name: "Sample Contest",
    startTime: sampleStart,
    endTime: sampleEnd,
    mode: "OI",
    probList: []
};
