import { DOM } from "./scripts/lib/HtmlModifier";
// import App from "./scripts/App";

async function init() {
    if (/*await DOM.hasElement("div.two")*/ true) {
        // unsafeWindow.WayFu = new App(unsafeWindow);
    } else {
        await init();
    }
}
init();
