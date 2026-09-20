const fs = require("fs");
const path = require("path");

const songsDir = path.join(__dirname, "songs");

let index = 0;

const getSongs = () => {
    return fs.readdirSync(songsDir)
        .filter(f => f.toLowerCase().endsWith(".mp3"));
};

const showSongs = () => {
    console.clear();

    const songs = getSongs();

    console.log("=================================");
    console.log("        🎵 TERMINAL PLAYER");
    console.log("=================================\n");

    console.log("ALL SONGS\n");

    if (!songs.length) {
        console.log("No songs found.\n");
    } else {
        songs.forEach((song, i) => {
            console.log(`${i === index ? ">" : " "} ${i} : ${song}`);
        });
    }

    console.log("\n---------------------------------");
    console.log("↑ ↓  : Select");
    console.log("ENTER: Play");
    console.log("A    : Pause");
    console.log("D    : Resume");
    console.log("1    : Favourites");
    console.log("2    : All Songs");
    console.log("Q    : Quit");

    console.log("\n■ No song playing");
};

showSongs();