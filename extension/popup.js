function updateDOM(text) {
  document.getElementById("entity-of").innerText = JSON.stringify(
    text,
    null,
    2
  );
}

browser.runtime.onMessage.addListener((message) => {
  // if (event.data.type === "entity-of-init") {
  //   const store = event.data.data;
  //   window.__ENTITY_OF__ = store;
  // }
  alert("acici");
  updateDOM(message);
});
