import removeAccents from "remove-accents";

const numberOptions = "40123456789";
const getRandomNumber = (cap: number) => Math.floor(Math.random() * cap);
const getRandomItem = (str: string) => str.charAt(getRandomNumber(str.length));
const getRandomChar = () => getRandomItem(numberOptions);
function generateRandomId() {
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += getRandomChar();
  }
  return id;
}

export default function generateId(title: string): string {
  let titleId = title.toLowerCase().slice(0, 30);
  titleId = removeAccents(titleId);
  titleId = titleId.replace(/ /g, "-").replace(/[^a-z0-9-]/gi, "");
  return `${titleId}-${generateRandomId()}`;
}
