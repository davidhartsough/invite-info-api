import { createEvent, DateArray, EventAttributes } from "ics";
import type { EventInfo } from "./types";

function getUTC(dt: number): string {
  return `${new Date(dt)
    .toISOString()
    .slice(0, 16)
    .replace(/-/g, "")
    .replace(":", "")}00Z`;
}

export function getGCalLink(eventInfo: EventInfo): string {
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

export function getICSLink(eventInfo: EventInfo): string {
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
