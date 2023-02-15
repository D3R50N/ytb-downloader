/**
 * @returns l'onglet actif de chrome
 */
async function getCurrentTab() {
  let queryOptions = {
    active: true,
    lastFocusedWindow: true,
  };

  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
getCurrentTab().then((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: open_y2mate,
    });
});

function open_y2mate() {
  var id = window.location.href.split("=")[1];
  var url = "https://y2mate.com/youtube/" + id;
  window.open(url, "_blank");
  
}

dEventListener("click", getFiles); // au clic du bouton
