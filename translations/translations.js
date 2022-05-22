const languages = [{ name: "English", code: "en" }, { name: "հայերեն", code: "hy" }, { name: "Nederlands", code: "nl" }, { name: "Français", code: "fr" }, { name: "Español", code: "es" }];
export { languages };

const en = require("./en.json");


export default function translate(lang, item, key) {
    if (lang === "en") {
        return en[item][key];
    } else if (lang === "hy") {
        const hy = require("./hy.json");
        if (!hy[item] || !hy[item][key]) {
            return hy[item][key];
        }
        return hy[item][key];
    } else if (lang === "nl") {
        const nl = require("./nl.json");
        if (!nl[item] || !nl[item][key]) {
            return en[item][key];
        }
        return nl[item][key];
    } else if (lang === "fr") {
        const fr = require("./fr.json");
        if (!fr[item] || !fr[item][key]) {
            return en[item][key];
        }
        return fr[item][key];
    } else if (lang === "es") {
        const es = require("./es.json");
        if (!es[item] || !es[item][key]) {
            return en[item][key];
        }
        return es[item][key];
    } else {
        return en[item][key];
    }
}