function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", file);
  th.appendChild(s);
}

const listener = window.addEventListener("message", (event) => {
  if (event.data.type === "entity-of-init") {
    window.__ENTITY_OF__ = event.data.data;
    // browser.tabs.sendMessage(tab, JSON.stringify(window.__ENTITY_OF__));
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs);
    });
  }
});

injectScript(browser.extension.getURL("inject.js"), "body");
