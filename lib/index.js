"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.info = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger_1 = require("firebase-functions/logger");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const remove_accents_1 = __importDefault(require("remove-accents"));
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)().collection("events");
// const cors = "invite-info.web.app";
const cors = true;
function get(id) {
    return db.doc(id).get();
}
function set(id, data) {
    return db.doc(id).create(data);
}
function getEventInfo({ title, start, end, location, description, email, link, }) {
    const eventInfo = { title, start, end, location, description };
    if (email) {
        eventInfo.email = email;
    }
    if (link) {
        eventInfo.link = link;
    }
    return eventInfo;
}
exports.info = (0, https_1.onRequest)({ cors }, async (req, res) => {
    (0, logger_1.log)("info invoked");
    const { id } = req.query;
    (0, logger_1.log)(id);
    if (typeof id !== "string") {
        (0, logger_1.log)("400 invalid");
        res.status(400).json({ message: "Invalid request", id });
    }
    else {
        (0, logger_1.log)("let's go get info");
        const doc = await get(id);
        if (!doc.exists) {
            (0, logger_1.log)("404 not found");
            res.status(404).json({ message: "Not found", id });
        }
        else {
            const data = Object.assign({ id: doc.id }, getEventInfo(doc.data()));
            (0, logger_1.log)(`got an event titled: "${data.title}"`);
            (0, logger_1.log)("200 success");
            res.status(200).json({ info: data });
        }
    }
});
const numberOptions = "40123456789";
const getRandomNumber = (cap) => Math.floor(Math.random() * cap);
const getRandomItem = (str) => str.charAt(getRandomNumber(str.length));
const getRandomChar = () => getRandomItem(numberOptions);
function generateRandomId() {
    let id = "";
    for (let i = 0; i < 4; i++) {
        id += getRandomChar();
    }
    return id;
}
function generateId(title) {
    let titleId = title.toLowerCase().slice(0, 30);
    titleId = (0, remove_accents_1.default)(titleId);
    titleId = titleId.replace(/ /g, "-").replace(/[^a-z0-9-]/gi, "");
    return `${titleId}-${generateRandomId()}`;
}
function isValidTimeStampNumber(ts) {
    return (typeof ts === "number" && Number.isSafeInteger(ts) && ts > 1600000000000);
}
const urlPattern = /^(https?:\/\/)((?!-)(?!.*--)[a-zA-Z\-0-9]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}(\/[^\s]*)?$/;
const emailPattern = /^([^<>()[\]\\.,;:\s@"]{1,63})@((((?!-)(?!.*--)[a-zA-Z\-0-9]{1,63}(?<!-))+\.)+([a-zA-Z]{2,63}))$/;
function isValidEmail(email) {
    return (typeof email === "string" &&
        email.length >= 2 &&
        email.length <= 150 &&
        emailPattern.test(email));
}
function isValidURL(url) {
    return (typeof url === "string" &&
        url.length >= 2 &&
        url.length <= 150 &&
        urlPattern.test(url));
}
function isEventInfo(eventInfo) {
    const { title, start, end, location, description, email, link } = eventInfo;
    if (email && !isValidEmail(email))
        return false;
    if (link && !isValidURL(link))
        return false;
    return (typeof title === "string" &&
        title.length >= 2 &&
        title.length <= 80 &&
        typeof location === "string" &&
        location.length >= 2 &&
        location.length <= 140 &&
        typeof description === "string" &&
        description.length >= 2 &&
        description.length <= 800 &&
        isValidTimeStampNumber(start) &&
        isValidTimeStampNumber(end));
}
exports.create = (0, https_1.onRequest)({ cors }, async (req, res) => {
    (0, logger_1.log)("create invoked");
    const { eventInfo } = req.body;
    if (!isEventInfo(eventInfo)) {
        (0, logger_1.log)("400 invalid");
        res.status(400).json({ message: "Invalid request", eventInfo });
    }
    else {
        (0, logger_1.log)("let's go create this event");
        const data = getEventInfo(eventInfo);
        (0, logger_1.log)(`gonna make an event titled: "${eventInfo.title}"`);
        const id = generateId(eventInfo.title);
        (0, logger_1.log)(id);
        await set(id, data);
        (0, logger_1.log)("200 success");
        res.status(200).json({ info: Object.assign({ id }, data) });
    }
});
//# sourceMappingURL=index.js.map