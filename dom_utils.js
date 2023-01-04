function src_attr(image) {
    let obj = {
        src: null,
        attr: "",
    };
    if (image.getAttribute("src")) {
        obj.src = image.getAttribute("src");
        obj.attr = ("src");
    } else if (image.getAttribute("data-src")) {
        obj.src = image.getAttribute("data-src");
        obj.attr = ("data-src");
    } else if (image.getAttribute("data-lazy-src")) {
        obj.src = image.getAttribute("data-lazy-src");
        obj.attr = ("data-lazy-src");
    } else if (image.getAttribute("data-lazy")) {
        obj.src = image.getAttribute("data-lazy");
        obj.attr = ("data-lazy");
    } else if (image.getAttribute("data-srcset")) {
        obj.src = image.getAttribute("data-srcset");
        obj.attr = ("data-srcset");
    } else if (image.getAttribute("data-original")) {
        obj.src = image.getAttribute("data-original");
        obj.attr = ("data-original");
    } else if (image.getAttribute("data-original-src")) {
        obj.src = image.getAttribute("data-original-src");
        obj.attr = ("data-original-src");
    } else if (image.getAttribute("data-defer-src")) {
        obj.src = image.getAttribute("data-defer-src");
        obj.attr = ("data-defer-src");
    } else if (image.getAttribute("data-deferred-src")) {
        obj.src = image.getAttribute("data-deferred-src");
        obj.attr = ("data-deferred-src");
    } else if (image.getAttribute("data-load")) {
        obj.src = image.getAttribute("data-load");
        obj.attr = ("data-load");
    } else if (image.getAttribute("data-loaded")) {
        obj.src = image.getAttribute("data-loaded");
        obj.attr = ("data-loaded");
    } else if (image.getAttribute("data-ll-status")) {
        obj.src = image.getAttribute("data-ll-status");
        obj.attr = ("data-ll-status");
    } else if (image.getAttribute("data-ll-src")) {
        obj.src = image.getAttribute("data-ll-src");
        obj.attr = ("data-ll-src");
    } else if (image.getAttribute("data-ll-url")) {
        obj.src = image.getAttribute("data-ll-url");
        obj.attr = ("data-ll-url");
    } else if (image.getAttribute("data-ll-image")) {
        obj.src = image.getAttribute("data-ll-image");
        obj.attr = ("data-ll-image");
    } else if (image.getAttribute("data-ll")) {
        obj.src = image.getAttribute("data-ll");
        obj.attr = ("data-ll");
    } else if (image.getAttribute("data-img-src")) {
        obj.src = image.getAttribute("data-img-src");
        obj.attr = ("data-img-src");
    } else if (image.getAttribute("data-img-url")) {
        obj.src = image.getAttribute("data-img-url");
        obj.attr = ("data-img-url");
    } else if (image.getAttribute("data-img-srcset")) {
        obj.src = image.getAttribute("data-img-srcset");
        obj.attr = ("data-img-srcset");
    } else if (image.getAttribute("data-img")) {
        obj.src = image.getAttribute("data-img");
        obj.attr = ("data-img");
    } else if (image.getAttribute("data-image-src")) {
        obj.src = image.getAttribute("data-image-src");
        obj.attr = ("data-image-src");
    } else if (image.getAttribute("data-image-url")) {
        obj.src = image.getAttribute("data-image-url");
        obj.attr = ("data-image-url");
    } else if (image.getAttribute("data-image-srcset")) {
        obj.src = image.getAttribute("data-image-srcset");
        obj.attr = ("data-image-srcset");
    } else if (image.getAttribute("data-image")) {
        obj.src = image.getAttribute("data-image");
        obj.attr = ("data-image");
    } else if (image.getAttribute("data-echo")) {
        obj.src = image.getAttribute("data-echo");
        obj.attr = ("data-echo");
    } else if (image.getAttribute("data-echo-background")) {
        obj.src = image.getAttribute("data-echo-background");
        obj.attr = ("data-echo-background");
    } else if (image.getAttribute("data-echo-src")) {
        obj.src = image.getAttribute("data-echo-src");
        obj.attr = ("data-echo-src");
    } else if (image.getAttribute("data-echo-srcset")) {
        obj.src = image.getAttribute("data-echo-srcset");
        obj.attr = ("data-echo-srcset");
    } else if (image.getAttribute("data-echo-url")) {
        obj.src = image.getAttribute("data-echo-url");
        obj.attr = ("data-echo-url");
    } else if (image.getAttribute("data-echo-image")) {
        obj.src = image.getAttribute("data-echo-image");
        obj.attr = ("data-echo-image");
    }
    return obj;
}

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