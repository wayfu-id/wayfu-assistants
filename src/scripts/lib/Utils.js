import { allCatalogues } from "./Constants";

/**
 *
 * @param {String} url
 * @returns {boolean}
 */
const isCatalogue = (url) => {
    return allCatalogues.some((e) => url.includes(e));

    // return (
    //     url.includes("Catalog") ||
    //     url.includes("catalogue") ||
    //     url.includes("beautyfestival")
    // );
};

/**
 *
 * @param {String} url
 * @param {String} thisUrl
 * @returns {String}
 */
const remakeUrl = (url, thisUrl) => {
    return thisUrl.includes("id-catalogue") || thisUrl.includes("beautyfestival")
        ? url
        : url.replace(/^(.*)\?(.*)$/, function (m, g1, g2) {
              let extra = !isCatalogue(url) ? `?${forExternalImage(g2)}` : "";
              return `${g1}${extra}`;
          });
};

/**
 *
 * @param {String} url
 * @returns {String}
 */
const forExternalImage = (url) => {
    let imgParams = new URLSearchParams(url),
        useless = [];
    imgParams.forEach((val, key) => {
        if (key != "externalMediaId") useless.push(key);
    });
    useless.forEach((e) => imgParams.delete(e));

    imgParams.append("imageFormat", "PNG");
    return imgParams.toString();
};

/**
 *
 * @param {String} url
 * @returns {String}
 */
const getProductName = (url) => {
    return /\d*(?:_\d*)*.png/g.exec(url).toString();
};

/**
 *
 * @param {String} url
 * @param {String} thisUrl
 * @returns {String}
 */
const nextUrl = (url, thisUrl) => {
    let isCat = thisUrl.includes("id-catalogue") || thisUrl.includes("beautyfestival"),
        rgx = isCat ? /^(.*Pages\/)(\d+)(\/.*)$/g : /^(.*\d{4,}-)(\d{3})(.*)(?:\?.*)?$/g;
    url = url.replace(rgx, function (m, g1, g2, g3) {
        let next = isCat ? `${parseInt(g2) + 1}` : `${parseInt(g2) + 1}`.padStart(3, "0");
        return g1 + next + g3;
    });
    return url;
};

/**
 *
 * @param {String} url
 * @param {String} thisUrl
 * @returns {{ period: String, name: String }}
 */
const getDetails = (url, thisUrl) => {
    let period, fileName;
    if (!(thisUrl.includes("id-catalogue") || thisUrl.includes("beautyfestival"))) {
        url.replace(/^.*\/((\d{4,}).*)\..*$/g, function (m, g1, g2) {
            fileName = `${g1}.jpg`;
            period = g2;
        });
    } else {
        period = (/\d{4,}/.exec(thisUrl) || /\d{4,}/.exec(title.text)).toString();
        fileName = url.replace(/^(?:.*Pages\/)(\d+)(?:\/.*)$/g, function (m, g1) {
            return `${period}_${g1}.jpg`;
        });
        if (thisUrl.includes("beautyfestival")) period = `BF${period}`;
    }
    return { period: period, name: fileName };
};
