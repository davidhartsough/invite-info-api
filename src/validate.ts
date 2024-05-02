import type { EventInfo } from "./types";

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

export function isEventInfo(eventInfo: EventInfo): eventInfo is EventInfo {
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
