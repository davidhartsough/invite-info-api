"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getICSLink = exports.getGCalLink = void 0;
const ics_1 = require("ics");
function getUTC(dt) {
    return `${new Date(dt)
        .toISOString()
        .slice(0, 16)
        .replace(/-/g, "")
        .replace(":", "")}00Z`;
}
function getGCalLink(eventInfo) {
    const startUTC = getUTC(eventInfo.start);
    const endUTC = getUTC(eventInfo.end);
    const searchParams = new URLSearchParams({
        action: "TEMPLATE",
        dates: `${startUTC}/${endUTC}`,
        text: eventInfo.title,
        location: eventInfo.location,
        details: eventInfo.description,
    });
    return `https://calendar.google.com/calendar/event?${searchParams.toString()}`;
}
exports.getGCalLink = getGCalLink;
function getDateTimeArray(ts) {
    const [date, time] = new Date(ts).toISOString().slice(0, 16).split("T");
    return [...date.split("-"), ...time.split(":")].map(Number);
}
function getICSLink(eventInfo) {
    let description = eventInfo.description;
    const icsData = {
        title: eventInfo.title,
        location: eventInfo.location,
        start: getDateTimeArray(eventInfo.start),
        end: getDateTimeArray(eventInfo.end),
        startInputType: "utc",
        endInputType: "utc",
        productId: "Invite Info",
    };
    if (eventInfo.email) {
        description += `\n\nContact Email: ${eventInfo.email}`;
    }
    if (eventInfo.link) {
        icsData.url = eventInfo.link;
        description += `\n\nLink: ${eventInfo.link}`;
    }
    icsData.description = description;
    const { value } = (0, ics_1.createEvent)(icsData);
    return `data:text/calendar;charset=UTF-8,${encodeURIComponent(value)}`;
}
exports.getICSLink = getICSLink;
//# sourceMappingURL=calendar.js.map