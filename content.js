async function getCurrentTab() {
    let queryOptions = {
        active: true,
        lastFocusedWindow: true
    };

    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function counter(arr, word) {
    if (arr.length > 1) return arr.length + " " + word + "s";
    return arr.length + " " + word;
}


const count = document.getElementById("count");
const percent = document.getElementById("percent");
const btn = document.getElementById("btn");
btn.addEventListener('click', getFiles);

const scale = {
    factor: .8,
    width: 400,
    height: 400
}


var isFetching = false;
var total = 1;
var loadedImages = 0;
var tab;
var base;
getCurrentTab().then((t) => {
    tab = t;

    base = tab.url.split("/");
    base.pop();
    base = base.join("/");
});

function getFiles() {
    if (tab && !isFetching) {
        isFetching = true;
        btn.querySelector(".text").innerHTML = "En cours...   &nbsp;";
        btn.querySelector(".spinner").style.display = "block";
        var srcList = [];
        updateCounter(srcList);
        fetch(tab.url, {
                headers: {
                    "Accept": "text/html",
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then((response) => response.text())
            .then(async (html) => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, "text/html");

                var images = doc.getElementsByTagName('img');

                getImgCount(images);
                if (total == 0) {
                    btn.querySelector(".text").innerHTML = "Aucune image";
                    btn.querySelector(".spinner").style.display = "none";
                    count.innerHTML = "";
                    percent.innerHTML = "Ce site ne contient aucune image ou bloque son contenu";
                    waitAndReset();
                }

                const zip = new JSZip();

                for (let i = 0; i < images.length; i++) {
                    if (srcList.includes(src_attr(images[i]))) continue;
                    srcList.push(src_attr(images[i]));
                    updateCounter(srcList);

                    if (src_attr(images[i]) == null) {
                        nextImg(zip);
                        
                        continue;
                    }



                    await storeFileInZip(images, i, zip);
                }


            })
            .catch((err) => {
                // throw (err);
                btn.querySelector(".text").innerHTML = "Erreur de récupération";
                btn.querySelector(".spinner").style.display = "none";
                count.innerHTML = err.name;
                percent.innerHTML = err.message;
                waitAndReset();

            });
    }

}


function waitAndReset() {
    setTimeout(() => {
        btn.querySelector(".text").innerHTML = "Télécharger le zip";
        count.innerHTML = "";
        percent.innerHTML = "";
        total = 1;
        isFetching = false;
    }, 2500);
}

async function storeFileInZip(images, i, zip) {
    let path;
    let isHttp = false;
    if (src_attr(images[i]).includes("http")) {
        isHttp = true;
        path = src_attr(images[i]);
    } else {
        path = base + "/" + src_attr(images[i]);
    }

    let response;

    try {
        response = await fetch(path);
        if (!response.ok) {
            throw Error();
        };
        // en cas d'erreur de récupération
    } catch (err) {
        nextImg(zip); // on saute le fichier
        return;
    }

    let blob;
    try {
        blob = await response.blob();
        // en cas d'erreur de conversion
    } catch (err) {
        nextImg(zip); // on saute le fichier
        return;
    }


    let splitted = src_attr(images[i]).split("/");
    splitted.shift();
    splitted.shift();
    splitted.shift();

    let name = isHttp ? splitted.join("/") : src_attr(images[i]);

    name = escape_str(name);

    resizeImageAndStore(blob, zip, name, scale);
}

function resizeImageAndStore(blob, zip, name, scale) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    let img = new Image()
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
        scale.width = img.width * scale.factor;
        scale.height = img.height * scale.factor;

        canvas.width = scale.width;
        canvas.height = scale.height;

        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
            (newblob) => {
                if (newblob) {
                    zip.file(name, newblob, {
                        binary: true
                    });
                    nextImg(zip);
                }
            }

        );

    };

}

function nextImg(zip) {
    loadedImages++;
    generateFinalZip(zip);
}

function getImgCount(images) {
    let temp = [];
    total = 0;
    for (let i = 0; i < images.length; i++) {
        if (!temp.includes(src_attr(images[i])))
            total++;
        temp.push(src_attr(images[i]));
    }
}

function generateFinalZip(zip) {
    if (loadedImages < total) return;
    zip.generateAsync({
        type: 'blob'
    }).then(content => {

        if (obj_len(zip.files) == 0) {
            btn.querySelector(".text").innerHTML = "Fichier zip vide";
            btn.querySelector(".spinner").style.display = "none";
            count.innerHTML = "";
            percent.innerHTML = total + " images ont été trouvées mais aucune n'a pu être récupérée.";
            waitAndReset();
            return;
        }

        saveAs(content, tab.title + ".zip");
        resetView();
    }).catch(error => {
        resetView();
    });
}

function obj_len(obj) {
    let len = 0;
    for (let key in obj) {
        len++;
    }
    return len;
}

function resetView() {
    isFetching = false;
    btn.querySelector(".text").innerHTML = "Télécharger le zip";
    btn.querySelector(".spinner").style.display = "none";
}

function updateCounter(srcList) {
    count.innerHTML = "📄" +
        counter(srcList, "image");
    percent.innerHTML = Math.floor(srcList.length * 100 / total) + "%";
}