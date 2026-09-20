const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const songsDir = path.join(__dirname, "songs");
const favDir = path.join(__dirname, "favourites");

if (!fs.existsSync(favDir)) fs.mkdirSync(favDir);

let player = null;
let index = 0;
let mode = "all";
let paused = false;

const getSongs = () => {
    const dir = mode === "all" ? songsDir : favDir;

    return fs.readdirSync(dir)
        .filter(f => f.toLowerCase().endsWith(".mp3"));
};

const showSongs = () => {

    console.clear();

    const songs = getSongs();

    console.log("=================================");
    console.log("        🎵 TERMINAL PLAYER");
    console.log("=================================\n");

    console.log(mode === "all" ? "ALL SONGS\n" : "FAVOURITES\n");

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

    if (paused) {
        console.log("\n⏸ Paused");
    } else if (player) {
        console.log("\n▶ Playing");
    } else {
        console.log("\n■ No song playing");
    }
};

const playSong = i => {

    const songs = getSongs();

    if (!songs[i]) return;

    if (player) {
        player.kill();
    }

    index = i;
    paused = false;

    const dir = mode === "all" ? songsDir : favDir;

    player = spawn("afplay", [
        path.join(dir, songs[i])
    ]);

    showSongs();
};

const pause = () => {

    if (player && !paused) {

        player.kill("SIGSTOP");

        paused = true;

        showSongs();
    }
};

const resume = () => {

    if (player && paused) {

        player.kill("SIGCONT");

        paused = false;

        showSongs();
    }
};

const quit = () => {

    if (player) {
        player.kill();
    }

    process.stdin.setRawMode(false);
    process.stdin.pause();

    console.clear();
    console.log("Goodbye! 👋");

    process.exit();
};

process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on("data", data => {

    const key = data[0];

    // Ctrl + C / Q
    if (key === 3 || key === 113 || key === 81) {
        quit();
    }

    // Arrow keys
    if (data[0] === 27 && data[1] === 91) {

        const songs = getSongs();

        // UP
        if (data[2] === 65 && index > 0) {
            index--;
        }

        // DOWN
        if (data[2] === 66 && index < songs.length - 1) {
            index++;
        }

        showSongs();
    }

    // ENTER
    if (key === 13) {
        playSong(index);
    }

    // A
    if (key === 65 || key === 97) {
        pause();
    }

    // D
    if (key === 68 || key === 100) {
        resume();
    }

    // 1 = Favourites
    if (key === 49) {

        mode = "favourites";
        index = 0;

        showSongs();
    }

    // 2 = All Songs
    if (key === 50) {

        mode = "all";
        index = 0;

        showSongs();
    }
});

showSongs();