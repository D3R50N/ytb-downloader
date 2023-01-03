function src_attr(image) {
    if (image.getAttribute("src"))
        return image.getAttribute("src");
    else if (image.getAttribute("data-src"))
        return image.getAttribute("data-src");
    else if (image.getAttribute("data-lazy-src"))
        return image.getAttribute("data-lazy-src");
    else if (image.getAttribute("data-lazy"))
        return image.getAttribute("data-lazy");
    else if (image.getAttribute("data-srcset"))
        return image.getAttribute("data-srcset");
    else if (image.getAttribute("data-original"))
        return image.getAttribute("data-original");
    else if (image.getAttribute("data-original-src"))
        return image.getAttribute("data-original-src");
    else if (image.getAttribute("data-defer-src"))
        return image.getAttribute("data-defer-src");
    else if (image.getAttribute("data-deferred-src"))
        return image.getAttribute("data-deferred-src");
    else if (image.getAttribute("data-load"))
        return image.getAttribute("data-load");
    else if (image.getAttribute("data-loaded"))
        return image.getAttribute("data-loaded");
    else if (image.getAttribute("data-ll-status"))
        return image.getAttribute("data-ll-status");
    else if (image.getAttribute("data-ll-src"))
        return image.getAttribute("data-ll-src");
    else if (image.getAttribute("data-ll-url"))
        return image.getAttribute("data-ll-url");
    else if (image.getAttribute("data-ll-image"))
        return image.getAttribute("data-ll-image");
    else if (image.getAttribute("data-ll"))
        return image.getAttribute("data-ll");
    else if (image.getAttribute("data-img-src"))
        return image.getAttribute("data-img-src");
    else if (image.getAttribute("data-img-url"))
        return image.getAttribute("data-img-url");
    else if (image.getAttribute("data-img-srcset"))
        return image.getAttribute("data-img-srcset");
    else if (image.getAttribute("data-img"))
        return image.getAttribute("data-img");
    else if (image.getAttribute("data-image-src"))
        return image.getAttribute("data-image-src");
    else if (image.getAttribute("data-image-url"))
        return image.getAttribute("data-image-url");
    else if (image.getAttribute("data-image-srcset"))
        return image.getAttribute("data-image-srcset");
    else if (image.getAttribute("data-image"))
        return image.getAttribute("data-image");
    else if (image.getAttribute("data-echo"))
        return image.getAttribute("data-echo");
    else if (image.getAttribute("data-echo-background"))
        return image.getAttribute("data-echo-background");
    else if (image.getAttribute("data-echo-src"))
        return image.getAttribute("data-echo-src");
    else if (image.getAttribute("data-echo-srcset"))
        return image.getAttribute("data-echo-srcset");
    else if (image.getAttribute("data-echo-url"))
        return image.getAttribute("data-echo-url");
    else if (image.getAttribute("data-echo-image"))
        return image.getAttribute("data-echo-image");

    return image.getAttribute("data-echo-bg")
}

function escape_str(str) {
    let name=str;
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