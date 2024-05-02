import { onRequest } from "firebase-functions/v2/https";
import { log } from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { EventInfo } from "./types";

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

export const info = onRequest({ cors }, async (req, res) => {
  log("info invoked");
  if (
    req.method === "PUT" ||
    req.method === "POST" ||
    req.method === "DELETE"
  ) {
    res.status(403).send("Forbidden");
    return;
  }
  const id = req.query.i;
  log(id);
  if (typeof id !== "string") {
    log("400 invalid");
    res.status(400).json({ message: "Invalid request", id });
    return;
  }

  log("let's go get info");
  const doc = await get(id);
  if (!doc.exists) {
    log("404 not found");
    res.status(404).json({ message: "Not found", id });
    return;
  }

  const eventInfo = getEventInfo(doc.data() as EventInfo);
  log(`got an event titled: "${eventInfo.title}"`);

  const calendarUtils = await import("./calendar");
  const icsLink = calendarUtils.getICSLink(eventInfo);
  const gCalLink = calendarUtils.getGCalLink(eventInfo);

  const renderPage = (await import("./render")).default;
  const html = renderPage({
    id: doc.id,
    ...eventInfo,
    icsLink,
    gCalLink,
  });
  log("200 success");
  res.status(200).send(html);
  return;
});

export const create = onRequest({ cors }, async (req, res) => {
  log("create invoked");
  if (req.method !== "POST") {
    res.status(400).json({ message: "Invalid method" });
  }
  const { eventInfo } = req.body;

  try {
    const validator = await import("./validate");
    if (!validator.isEventInfo(eventInfo)) {
      log("400 invalid");
      res.status(400).json({ message: "Invalid request", eventInfo });
      return;
    }
  } catch (error) {
    log("400 invalid");
    log(error);
    res.status(400).json({ message: "Invalid request", eventInfo, error });
    return;
  }

  const data = getEventInfo(eventInfo);
  log(`let's go make an event titled: "${eventInfo.title}"`);
  const generateId = (await import("./generate")).default;
  const id = generateId(eventInfo.title);
  log(id);
  await set(id, data);
  log("200 success");
  res.status(200).json({ id });
  return;
});
