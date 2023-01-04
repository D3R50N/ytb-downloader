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

function getSize(srcattr) {
    // console.log(document.querySelector(`img[${srcattr.attr}="${srcattr.src}"]`))
    return {
        w: document.querySelector(`img[${srcattr.attr}="${srcattr.src}"]`).width,
        h: document.querySelector(`img[${srcattr.attr}="${srcattr.src}"]`).height
    };
}

function getFiles() {
    if (tab && !isFetching) {


        try {
            getDOMContent()
        } catch (err) {
            throw (err);
            btn.querySelector(".text").innerHTML = "Erreur de récupération";
            btn.querySelector(".spinner").style.display = "none";
            count.innerHTML = err.name;
            percent.innerHTML = err.message;
            waitAndReset();

        };
    }

}


function getDOMContent() {
    chrome.scripting.executeScript({
            target: {
                tabId: tab.id,
                allFrames: true
            },
            func: () => {
                return document.documentElement.outerHTML;
            },
        },

        (r) => {
            if (r[0].result) {
                var html = r[0].result;
                console.log("DOM loaded");
                getDom(html);
            } else {
                fetch(tab.url, {
                        headers: {
                            "Accept": "text/html",
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                    .then((response) => response.text())
                    .then(async (html) => {
                        getDom(html);
                    })

            }


        });

}

function getDom(html) {
    isFetching = true;
    btn.querySelector(".text").innerHTML = "En cours...   &nbsp;";
    btn.querySelector(".spinner").style.display = "block";
    var srcList = [];
    updateCounter(srcList);
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
        if (srcList.includes(src_attr(images[i]).src))
            continue;
        srcList.push(src_attr(images[i]).src);
        if (src_attr(images[i]).src == null) {
            nextImg(zip);
            continue;
        }


        let img_container_size = {};

        chrome.scripting.executeScript({
                target: {
                    tabId: tab.id,
                    allFrames: true
                },
                func: getSize,
                args: [src_attr(images[i])]
            },

            (r) => {
                if (r[0].result) {
                    img_container_size = r[0].result;

                }


                storeFileInZip(images, i, img_container_size, zip).then(() => {
                    updateCounter(srcList);
                })

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

async function storeFileInZip(images, i, size, zip) {
    let path;
    let isHttp = false;
    if (src_attr(images[i]).src.includes("http")) {
        isHttp = true;
        path = src_attr(images[i]).src;
    } else {
        path = base + "/" + src_attr(images[i]).src;
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


    let splitted = src_attr(images[i]).src.split("/");
    splitted.shift();
    splitted.shift();
    splitted.shift();

    let name = isHttp ? splitted.join("/") : src_attr(images[i]).src;

    name = escape_str(name);


    const scale = {
        width: size.w,
        height: size.h,
        factor: .8,
    }

    resizeImageAndStore(blob, zip, name, scale);
}

function resizeImageAndStore(blob, zip, name, scale) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    let img = new Image()
    img.src = URL.createObjectURL(blob);

    img.onerror = () => {
        nextImg(zip);
    }
    img.onload = () => {

        canvas.width = img.width * scale.factor;
        canvas.height = img.height * scale.factor;

        if (scale.width)
            canvas.width = scale.width;
        if (scale.height)
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
        if (!temp.includes(src_attr(images[i]).src))
            total++;
        temp.push(src_attr(images[i]).src);
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

        var zip_name = tab.url;

        let splitted = zip_name.split("/");
        
        splitted.shift();
        splitted.shift();

        zip_name = "WIO_"+splitted[0]+"_"+getDate()
        zip_name = escape_str(zip_name);
        saveAs(content, zip_name + ".zip");
        resetView();
    }).catch(error => {
        resetView();
    });
}

function getDate() {
    let now = new Date();
    return `${twoDigits(now.getDate())}-${twoDigits(now.getMonth()+1)}-${twoDigits(now.getFullYear())}`;
}
function twoDigits(num) {
    if (num < 10) return "0" + num;
    return num
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