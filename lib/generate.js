"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const remove_accents_1 = __importDefault(require("remove-accents"));
const numberOptions = "40123456789";
const getRandomNumber = (cap) => Math.floor(Math.random() * cap);
const getRandomItem = (str) => str.charAt(getRandomNumber(str.length));
const getRandomChar = () => getRandomItem(numberOptions);
function generateRandomId() {
    let id = "";
    for (let i = 0; i < 5; i++) {
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
exports.default = generateId;
//# sourceMappingURL=generate.js.map