
/**
 * 
 * @param {Array} images 
 * @param {int} i l'index de l'image
 * @param {object} size la taille de l'image en objet
 * @param {JSZip} zip le fichier zip
 */
async function storeFileInZip(images, i, size, zip) {
    let path;
    let isHttp = false;
    // si le lien contien http, alors on ne change pas
    if (src_attr(images[i]).src.includes("http")) {
        isHttp = true;
        path = src_attr(images[i]).src;
    } else {
        //sinon on récupère l'url de base et on ajoute le chemin chers l'image
        path = base + "/" + src_attr(images[i]).src;
    }


    let response;
    try {
        response = await fetch(path); // on récupère les données binaires de l'image
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


    let splitted = src_attr(images[i]).src.split("/"); // on récupère le chemin d'acccès découpé 

    splitted.shift(); 
    splitted.shift();
    splitted.shift();
    
    //Par exemple https://exemple/home devient exemple/home

    let name = isHttp ? splitted.join("/") : src_attr(images[i]).src;

    name = escape_str(name); 

    const scale = {
        width: size.w,
        height: size.h,
        factor: .8,
    }

    resizeImageAndStore(blob, zip, name, scale);
}

/**
 * Redimensionne l'image et la sauvegarde
 * @param {Blob} blob les données binaires
 * @param {JSZip} zip le zip
 * @param {string} name le nom de sauvegarde
 * @param {object} scale les dimensions
 */
function resizeImageAndStore(blob, zip, name, scale) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    let img = new Image()
    img.src = URL.createObjectURL(blob);

    img.onerror = () => {
        nextImg(zip);
    }
    img.onload = () => {

        // dimensions d'origine
        canvas.width = img.width * scale.factor; 
        canvas.height = img.height * scale.factor;

        // dimensions compressées
        if (scale.width)
            canvas.width = scale.width;
        if (scale.height)
            canvas.height = scale.height;

        // on rend l'image sur un canvas et on sauvegarde le canvas en format zip
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

/**
 * Passe à l'image suivante
 * - Si on est à la dernier image, on enregistre le fichier zip
 * @param {JSZip} zip le fichier zip
 */
function nextImg(zip) {
    loadedImages++;
    generateFinalZip(zip);
}


/**
 * On sauvegarde le fichier si le nombre d'images traitées correspond au nombre total
 * @param {JSZip} zip 
 */
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

        zip_name = "WIO_" + splitted[0] + "_" + getDate()
        zip_name = escape_str(zip_name);
        saveAs(content, zip_name + ".zip");
        resetView();
    }).catch(error => {
        resetView();
    });
}