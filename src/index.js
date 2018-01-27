'use strict'

const fs = require("fs");
const ArgumentParser = require("argparse").ArgumentParser;
const ncp = require("copy-paste");

const args = getParserData();
//  Navigation data.
const defaultNavFile = "data\\LHS-20-400dist-700max-populated.json";
const navFile = args.file ? args.file : defaultNavFile;
const navData = getData(navFile);
//  User data.
const userFile = "data\\user.json";
let userData = getData(userFile);
const userNavIndex = getUserNavIndex(userData, navFile);

console.log("Origin: " + navData.origin);

let currentSystem = userData.navFiles[userNavIndex].current.system;
console.log("Current: " + navData.path[currentSystem].system);
if (args.direction === "n") {
    if (currentSystem < navData.path.length) {
        currentSystem++;
        userData.navFiles[userNavIndex].current.system = currentSystem;
        writeData(userFile, JSON.stringify(userData));
    };
} else if (args.direction === "p") {
    if (currentSystem > 0) {
        currentSystem--;
        userData.navFiles[userNavIndex].current.system = currentSystem;
        writeData(userFile, JSON.stringify(userData));
    };
}
console.log("Current: " + navData.path[currentSystem].system);
ncp.copy(navData.path[currentSystem].system);

function getParserData() {
    var parser = new ArgumentParser({
        version: "0.1.0",
        addHelp: true,
        description: "Does stuff"
    });

    parser.addArgument(
        ["-f", "--file"],
        { help: "Defines JSON file path." });
    parser.addArgument(
        ["-d", "--direction"],
        {
            choices: "pnc",
            help: "(P)revious, (n)ext, or (c)urrent destination.",
            required: true
        }
    );

    return parser.parseArgs();
}

function getData(file) {
    const data = fs.readFileSync(file);
    return JSON.parse(data);
}

function writeData(file, data) {
    fs.writeFileSync(file, data);
}

function getUserNavIndex(userData, navFile) {
    for (let x = 0; x < userData.navFiles.length; x++) {
        if (userData.navFiles[x].navFile === navFile) {
            return x;
        }
    }
    return -1;
}

