const count = document.getElementById("count");
const percent = document.getElementById("percent");
const btn = document.getElementById("btn");

var isFetching = false;
var total = 1; // nb d'images
var loadedImages = 0;
var tab; // l'onglet actif
var base; // l'url de base