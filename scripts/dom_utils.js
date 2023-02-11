/**
 * @param {HTMLImageElement} image
 * @returns un objet qui contient le lien et le nom de l'attribut source de l'image
 */
function src_attr(image) {
  let obj = {
    src: null,
    attr: "",
  };
  if (image.getAttribute("src")) {
    obj.src = image.getAttribute("src");
    obj.attr = "src";
  } else if (image.getAttribute("data-src")) {
    obj.src = image.getAttribute("data-src");
    obj.attr = "data-src";
  } else if (image.getAttribute("data-lazy-src")) {
    obj.src = image.getAttribute("data-lazy-src");
    obj.attr = "data-lazy-src";
  } else if (image.getAttribute("data-lazy")) {
    obj.src = image.getAttribute("data-lazy");
    obj.attr = "data-lazy";
  } else if (image.getAttribute("data-srcset")) {
    obj.src = image.getAttribute("data-srcset");
    obj.attr = "data-srcset";
  } else if (image.getAttribute("data-original")) {
    obj.src = image.getAttribute("data-original");
    obj.attr = "data-original";
  } else if (image.getAttribute("data-original-src")) {
    obj.src = image.getAttribute("data-original-src");
    obj.attr = "data-original-src";
  } else if (image.getAttribute("data-defer-src")) {
    obj.src = image.getAttribute("data-defer-src");
    obj.attr = "data-defer-src";
  } else if (image.getAttribute("data-deferred-src")) {
    obj.src = image.getAttribute("data-deferred-src");
    obj.attr = "data-deferred-src";
  } else if (image.getAttribute("data-load")) {
    obj.src = image.getAttribute("data-load");
    obj.attr = "data-load";
  } else if (image.getAttribute("data-loaded")) {
    obj.src = image.getAttribute("data-loaded");
    obj.attr = "data-loaded";
  } else if (image.getAttribute("data-ll-status")) {
    obj.src = image.getAttribute("data-ll-status");
    obj.attr = "data-ll-status";
  } else if (image.getAttribute("data-ll-src")) {
    obj.src = image.getAttribute("data-ll-src");
    obj.attr = "data-ll-src";
  } else if (image.getAttribute("data-ll-url")) {
    obj.src = image.getAttribute("data-ll-url");
    obj.attr = "data-ll-url";
  } else if (image.getAttribute("data-ll-image")) {
    obj.src = image.getAttribute("data-ll-image");
    obj.attr = "data-ll-image";
  } else if (image.getAttribute("data-ll")) {
    obj.src = image.getAttribute("data-ll");
    obj.attr = "data-ll";
  } else if (image.getAttribute("data-img-src")) {
    obj.src = image.getAttribute("data-img-src");
    obj.attr = "data-img-src";
  } else if (image.getAttribute("data-img-url")) {
    obj.src = image.getAttribute("data-img-url");
    obj.attr = "data-img-url";
  } else if (image.getAttribute("data-img-srcset")) {
    obj.src = image.getAttribute("data-img-srcset");
    obj.attr = "data-img-srcset";
  } else if (image.getAttribute("data-img")) {
    obj.src = image.getAttribute("data-img");
    obj.attr = "data-img";
  } else if (image.getAttribute("data-image-src")) {
    obj.src = image.getAttribute("data-image-src");
    obj.attr = "data-image-src";
  } else if (image.getAttribute("data-image-url")) {
    obj.src = image.getAttribute("data-image-url");
    obj.attr = "data-image-url";
  } else if (image.getAttribute("data-image-srcset")) {
    obj.src = image.getAttribute("data-image-srcset");
    obj.attr = "data-image-srcset";
  } else if (image.getAttribute("data-image")) {
    obj.src = image.getAttribute("data-image");
    obj.attr = "data-image";
  } else if (image.getAttribute("data-echo")) {
    obj.src = image.getAttribute("data-echo");
    obj.attr = "data-echo";
  } else if (image.getAttribute("data-echo-background")) {
    obj.src = image.getAttribute("data-echo-background");
    obj.attr = "data-echo-background";
  } else if (image.getAttribute("data-echo-src")) {
    obj.src = image.getAttribute("data-echo-src");
    obj.attr = "data-echo-src";
  } else if (image.getAttribute("data-echo-srcset")) {
    obj.src = image.getAttribute("data-echo-srcset");
    obj.attr = "data-echo-srcset";
  } else if (image.getAttribute("data-echo-url")) {
    obj.src = image.getAttribute("data-echo-url");
    obj.attr = "data-echo-url";
  } else if (image.getAttribute("data-echo-image")) {
    obj.src = image.getAttribute("data-echo-image");
    obj.attr = "data-echo-image";
  }
  return obj;
}

/**
 * @description La fonction qui s'exécute au clic du bouton "Télécharger"
 * @description Elle ne se déclenche que si l'onglet actif n'est pas null et que le téléchargement n'est pas déjà en cours
 */
function getFiles() {
  if (tab && !isFetching) {
    try {
      getDOMContent();
    } catch (err) {
      // throw (err);
      // En cas d'erreur on affiche l'erreur pendant un instant
      btn.querySelector(".text").innerHTML = "Erreur de récupération";
      btn.querySelector(".spinner").style.display = "none";
      count.innerHTML = err.name;
      percent.innerHTML = err.message;
      waitAndReset();
    }
  }
}

/**
 * On essaie de récupérer le contenu de la page déjà chargée
 * - Si c'est ok, on traite ce contenu
 * - Sinon on lance une requête HTTP|GET sur l'url de la page pour récuper le contenu
 */
function getDOMContent() {
  chrome.scripting.executeScript(
    {
      target: {
        tabId: tab.id,
        allFrames: true,
      },
      func: () => {
        return document.documentElement.outerHTML;
      },
    },

    (r) => {
      if (r[0].result) {
        var html = r[0].result;
        console.log("DOM loaded");
        getImagesFromHTML(html);
      } else {
        fetch(tab.url, {
          headers: {
            Accept: "text/html",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((response) => response.text())
          .then(async (html) => {
            getImagesFromHTML(html);
          });
      }
    }
  );
}

/**
 * @param {string} html le contenu du document
 * @description on récupère chaque image et on la stocke dans un fichier zip
 */

function getImagesFromHTML(html) {
   
  isFetching = true;
  loadedImages = 0;

  btn.querySelector(".text").innerHTML = "En cours...   &nbsp;";
  btn.querySelector(".spinner").style.display = "block";

  var srcList = [];
  updateCounter(srcList);

  var parser = new DOMParser();
  var doc = parser.parseFromString(html, "text/html");

  var images = doc.getElementsByTagName("img");

  getImgCount(images); // on compte le nombre d'images pour le %

  // si il y en a pas, on actualise la vue
  if (total == 0) {
    btn.querySelector(".text").innerHTML = "Aucune image";
    btn.querySelector(".spinner").style.display = "none";
    count.innerHTML = "";
    percent.innerHTML =
      "Ce site ne contient aucune image ou bloque son contenu";
    waitAndReset();
  }

  const zip = new JSZip(); //notre fichier

  for (let i = 0; i < images.length; i++) {
    // si l'image a déjà été traitée on passe (au cas où la même image sooit dans deux balises)
    if (srcList.includes(src_attr(images[i]).src)) continue;

    srcList.push(src_attr(images[i]).src);

    // si l'image n'a pas de source (oui c'est possible), on la saute
    if (src_attr(images[i]).src == null) {
      nextImg(zip);
      continue;
    }

    let img_container_size = {}; // pour stocker la taille du conteneur

    // on essaie de stocker l'image das le zip après avoir pris sa taille
    chrome.scripting.executeScript(
      {
        target: {
          tabId: tab.id,
          allFrames: true,
        },
        func: getSize,
        args: [src_attr(images[i])],
      },

      (r) => {
        if (r[0].result) {
          img_container_size = r[0].result;
        }
        storeFileInZip(images, i, img_container_size, zip).then(() => {
          updateCounter(srcList);
        });
      }
    );
  }
}
/**
 * Compte le nombre d'image sans doublure
 * @param {Array} images
 */
function getImgCount(images) {
  let temp = [];
  total = 0;
  for (let i = 0; i < images.length; i++) {
    if (!temp.includes(src_attr(images[i]).src)) total++;
    temp.push(src_attr(images[i]).src);
  }
}
/**
 * patiente pendant 2, 5 s et réinitialise la vue
 */
function waitAndReset() {
  setTimeout(() => {
    total = 1;
    resetView();
    count.innerHTML = "";
    percent.innerHTML = "";
  }, 2500);
}

/**
 * réinitialise la vue
 */
function resetView() {
  isFetching = false;
  btn.querySelector(".text").innerHTML = "Télécharger le zip";
  btn.querySelector(".spinner").style.display = "none";
}

/**
 * actualise le compteur et le pourcentage
 * @param {Array} srcList un tableau de sources
 */
function updateCounter(srcList) {
//   count.innerHTML = "📄0 sur " + counter(srcList, "image");
  // percent.innerHTML = Math.floor(srcList.length * 100 / total) + "%";
//   percent.innerHTML = "0%";
}

/**
 * @param {object} srcattr un objet qui contient le lien et le nom de l'attribut source
 * @returns la taille de l'élément sur la page
 */

function getSize(srcattr) {
  return {
    w: document.querySelector(`img[${srcattr.attr}="${srcattr.src}"]`).width,
    h: document.querySelector(`img[${srcattr.attr}="${srcattr.src}"]`).height,
  };
}
