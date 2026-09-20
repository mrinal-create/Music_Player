const fs = require("fs");
const path = require("path");

const songsDir = path.join(__dirname, "songs");

const getSongs = () => {
    return fs.readdirSync(songsDir)
        .filter(f => f.toLowerCase().endsWith(".mp3"));
};

const songs = getSongs();

console.log("🎵 TERMINAL PLAYER\n");

if (!songs.length) {
    console.log("No songs found.");
} else {
    console.log("Available Songs:\n");

    songs.forEach((song, i) => {
        console.log(`${i} : ${song}`);
    });
}