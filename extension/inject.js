function init() {
  const store = window.__ENTITY_OF__;
  console.log("aici");
  window.postMessage({ type: "entity-of-init", data: store }, "*");
}

init();
