/**
 * @returns l'onglet actif de chrome
*/
async function getCurrentTab() {
    let queryOptions = {
        active: true,
        lastFocusedWindow: true
    };

    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}



getCurrentTab().then((t) => {
    tab = t;
    base = tab.url.split("/");
    base.pop();
    base = base.join("/");
});

btn.addEventListener('click', getFiles); // au clic du bouton
