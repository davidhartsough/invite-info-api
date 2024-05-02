"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.info = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger_1 = require("firebase-functions/logger");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)().collection("events");
const cors = "invite-info.web.app";
// const cors = true;
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
    if (req.method === "PUT" ||
        req.method === "POST" ||
        req.method === "DELETE") {
        res.status(403).send("Forbidden");
        return;
    }
    const id = req.query.i;
    (0, logger_1.log)(id);
    if (typeof id !== "string") {
        (0, logger_1.log)("400 invalid");
        res.status(400).json({ message: "Invalid request", id });
        return;
    }
    (0, logger_1.log)("let's go get info");
    const doc = await get(id);
    if (!doc.exists) {
        (0, logger_1.log)("404 not found");
        res.status(404).json({ message: "Not found", id });
        return;
    }
    const eventInfo = getEventInfo(doc.data());
    (0, logger_1.log)(`got an event titled: "${eventInfo.title}"`);
    const calendarUtils = await Promise.resolve().then(() => __importStar(require("./calendar")));
    const icsLink = calendarUtils.getICSLink(eventInfo);
    const gCalLink = calendarUtils.getGCalLink(eventInfo);
    const renderPage = (await Promise.resolve().then(() => __importStar(require("./render")))).default;
    const html = renderPage(Object.assign(Object.assign({ id: doc.id }, eventInfo), { icsLink,
        gCalLink }));
    (0, logger_1.log)("200 success");
    res.status(200).send(html);
    return;
});
exports.create = (0, https_1.onRequest)({ cors }, async (req, res) => {
    (0, logger_1.log)("create invoked");
    if (req.method !== "POST") {
        res.status(400).json({ message: "Invalid method" });
    }
    const { eventInfo } = req.body;
    try {
        const validator = await Promise.resolve().then(() => __importStar(require("./validate")));
        if (!validator.isEventInfo(eventInfo)) {
            (0, logger_1.log)("400 invalid");
            res.status(400).json({ message: "Invalid request", eventInfo });
            return;
        }
    }
    catch (error) {
        (0, logger_1.log)("400 invalid");
        (0, logger_1.log)(error);
        res.status(400).json({ message: "Invalid request", eventInfo, error });
        return;
    }
    const data = getEventInfo(eventInfo);
    (0, logger_1.log)(`let's go make an event titled: "${eventInfo.title}"`);
    const generateId = (await Promise.resolve().then(() => __importStar(require("./generate")))).default;
    const id = generateId(eventInfo.title);
    (0, logger_1.log)(id);
    await set(id, data);
    (0, logger_1.log)("200 success");
    res.status(200).json({ id });
    return;
});
//# sourceMappingURL=index.js.map