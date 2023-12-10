import { onRequest } from "firebase-functions/v2/https";
import { log } from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import removeAccents from "remove-accents";
import { createEvent, DateArray, EventAttributes } from "ics";

initializeApp();
const db = getFirestore().collection("events");

const cors = "invite-info.web.app";
// const cors = true;

function get(id: string) {
  return db.doc(id).get();
}
function set(
  id: string,
  data: FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>
) {
  return db.doc(id).create(data);
}

type EventInfo = {
  title: string;
  start: number;
  end: number;
  location: string;
  description: string;
  link?: string;
  email?: string;
};

function getEventInfo({
  title,
  start,
  end,
  location,
  description,
  email,
  link,
}: EventInfo): EventInfo {
  const eventInfo: EventInfo = { title, start, end, location, description };
  if (email) {
    eventInfo.email = email;
  }
  if (link) {
    eventInfo.link = link;
  }
  return eventInfo;
}

function getUTC(dt: number): string {
  return `${new Date(dt)
    .toISOString()
    .slice(0, 16)
    .replace(/-/g, "")
    .replace(":", "")}00Z`;
}

function getGCalLink(eventInfo: EventInfo): string {
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

function getDateTimeArray(ts: number): DateArray {
  const [date, time] = new Date(ts).toISOString().slice(0, 16).split("T");
  return [...date.split("-"), ...time.split(":")].map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ];
}

function getICSLink(eventInfo: EventInfo): string {
  let description = eventInfo.description;
  const icsData: EventAttributes = {
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
  const { value } = createEvent(icsData);
  return `data:text/calendar;charset=UTF-8,${encodeURIComponent(
    value as string
  )}`;
}

export const info = onRequest({ cors }, async (req, res) => {
  log("info invoked");
  const { id } = req.query;
  log(id);
  if (typeof id !== "string") {
    log("400 invalid");
    res.status(400).json({ message: "Invalid request", id });
  } else {
    log("let's go get info");
    const doc = await get(id);
    if (!doc.exists) {
      log("404 not found");
      res.status(404).json({ message: "Not found", id });
    } else {
      const eventInfo = getEventInfo(doc.data() as EventInfo);
      log(`got an event titled: "${eventInfo.title}"`);
      const icsLink = getICSLink(eventInfo);
      const gCalLink = getGCalLink(eventInfo);
      log("200 success");
      res.status(200).json({
        info: {
          id: doc.id,
          ...eventInfo,
          icsLink,
          gCalLink,
        },
      });
    }
  }
});

const numberOptions = "40123456789";
const getRandomNumber = (cap: number) => Math.floor(Math.random() * cap);
const getRandomItem = (str: string) => str.charAt(getRandomNumber(str.length));
const getRandomChar = () => getRandomItem(numberOptions);
function generateRandomId() {
  let id = "";
  for (let i = 0; i < 4; i++) {
    id += getRandomChar();
  }
  return id;
}
function generateId(title: string): string {
  let titleId = title.toLowerCase().slice(0, 30);
  titleId = removeAccents(titleId);
  titleId = titleId.replace(/ /g, "-").replace(/[^a-z0-9-]/gi, "");
  return `${titleId}-${generateRandomId()}`;
}

function isValidTimeStampNumber(ts: number): boolean {
  return (
    typeof ts === "number" && Number.isSafeInteger(ts) && ts > 1600000000000
  );
}

const urlPattern =
  /^(https?:\/\/)((?!-)(?!.*--)[a-zA-Z\-0-9]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}(\/[^\s]*)?$/;
const emailPattern =
  /^([^<>()[\]\\.,;:\s@"]{1,63})@((((?!-)(?!.*--)[a-zA-Z\-0-9]{1,63}(?<!-))+\.)+([a-zA-Z]{2,63}))$/;

function isValidEmail(email: string): boolean {
  return (
    typeof email === "string" &&
    email.length >= 2 &&
    email.length <= 150 &&
    emailPattern.test(email)
  );
}
function isValidURL(url: string): boolean {
  return (
    typeof url === "string" &&
    url.length >= 2 &&
    url.length <= 150 &&
    urlPattern.test(url)
  );
}

function isEventInfo(eventInfo: EventInfo): eventInfo is EventInfo {
  const { title, start, end, location, description, email, link } = eventInfo;
  if (email && !isValidEmail(email)) return false;
  if (link && !isValidURL(link)) return false;
  return (
    typeof title === "string" &&
    title.length >= 2 &&
    title.length <= 80 &&
    typeof location === "string" &&
    location.length >= 2 &&
    location.length <= 140 &&
    typeof description === "string" &&
    description.length >= 2 &&
    description.length <= 800 &&
    isValidTimeStampNumber(start) &&
    isValidTimeStampNumber(end)
  );
}

export const create = onRequest({ cors }, async (req, res) => {
  log("create invoked");
  const { eventInfo } = req.body;
  if (!isEventInfo(eventInfo)) {
    log("400 invalid");
    res.status(400).json({ message: "Invalid request", eventInfo });
  } else {
    log("let's go create this event");
    const data = getEventInfo(eventInfo);
    log(`gonna make an event titled: "${eventInfo.title}"`);
    const id = generateId(eventInfo.title);
    log(id);
    await set(id, data);
    const icsLink = getICSLink(data);
    const gCalLink = getGCalLink(data);
    log("200 success");
    res.status(200).json({
      info: {
        id,
        ...data,
        icsLink,
        gCalLink,
      },
    });
  }
});
