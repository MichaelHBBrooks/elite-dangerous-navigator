"use strict";

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

const sysIndex = getSystem(
    userData.navFiles[userNavIndex].current.system,
    args.direction,
    navData.path.length
);
if (args.planets) {
    printPlanets(navData.path[sysIndex].system, navData.path[sysIndex].planets);
} else {
    console.log(navData.path[sysIndex].system);
}

if (!args.planets && sysIndex !== userData.navFiles[userNavIndex].current.system) {
    userData.navFiles[userNavIndex].current.system = sysIndex;
    writeData(userFile, JSON.stringify(userData));
}

ncp.copy(navData.path[sysIndex].system);

function getParserData() {
    var parser = new ArgumentParser({
        version: "0.1.0",
        addHelp: true,
        description: "Does stuff"
    });

    parser.addArgument(["-f", "--file"], { help: "Defines JSON file path." });
    parser.addArgument(["-d", "--direction"], {
        choices: "pnc",
        help: "(P)revious, (n)ext, or (c)urrent destination.",
        required: true
    });
    parser.addArgument(["-p", "--planets"], {
        help: "List planets in target system.",
        action: "storeTrue"
    });

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

function getSystem(systemIndex, direction, maxSystems) {
    if (direction === "n") {
        if (systemIndex < maxSystems) {
            systemIndex++;
        }
    } else if (direction === "p") {
        if (systemIndex > 0) {
            systemIndex--;
        }
    }
    return systemIndex;
}

function printPlanets(system, planets) {
    let text = `There ${planets.length > 1 ? "are" : "is"} ${planets.length} planet${
        planets.length > 1 ? "s" : ""
    } in ${system}.`;
    if (planets.length > 0) {
        text += " Planet " + planets[0].name + " with a distance of " + planets[0].distance;
        for (let x = 1; x < planets.length; x++) {
            text += ", planet " + planets[x].name + " with a distance of " + planets[x].distance;
        }
        text += ".";
    }
    console.log(text);
}
