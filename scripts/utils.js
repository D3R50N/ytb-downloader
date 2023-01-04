
/**
 * 
 * @param {string} str 
 * @returns une chaine de caractère sans caractère spécial
 */
function escape_str(str) {
    let name = str;
    name = name.replaceAll("%", "");
    name = name.replaceAll("?", "");
    name = name.replaceAll("=", "");
    name = name.replaceAll("&", "");
    name = name.replaceAll(":", "");
    name = name.replaceAll(";", "");
    name = name.replaceAll("|", "");
    name = name.replaceAll("*", "");
    name = name.replaceAll("<", "");
    name = name.replaceAll(">", "");
    name = name.replaceAll("'", "");

    return name;
}

/**
 * 
 * @param {Array} arr un tableau
 * @param {string} word 
 * @returns la taille du tableau suivi du mot au singulier ou au pluriel
 */
function counter(arr, word) {
    if (arr.length > 1) return arr.length + " " + word + "s";
    return arr.length + " " + word;
}


/**
 * 
 * @returns la date actuelle sous la forme JJ-MM-YYY
 */
function getDate() {
    let now = new Date();
    return `${twoDigits(now.getDate())}-${twoDigits(now.getMonth()+1)}-${twoDigits(now.getFullYear())}`;
}

/**
 * 
 * @param {int} num 
 * @returns un chiffre préfixé par 0
 */
function twoDigits(num) {
    if (num < 10) return "0" + num;
    return num
}

/**
 * 
 * @param {object} obj 
 * @returns la longueur d'un objet (comme un tableau)
 */
function obj_len(obj) {
    let len = 0;
    for (let key in obj) {
        len++;
    }
    return len;
}

