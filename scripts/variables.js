const count = document.getElementById("count");
const percent = document.getElementById("percent");
const btn = document.getElementById("btn");
const opt_resize = document.getElementById("resize");
const opt_ignore = document.getElementById("ignore_icons");
const iconSize = 50; // 32 ou 48
var isFetching = false;
var total = 1; // nb d'images
var loadedImages = 0;
var tab; // l'onglet actif
var base; // l'url de base

var shoudResize = () => opt_resize.checked;
var shouldIgnoreIcons = () => opt_ignore.checked;