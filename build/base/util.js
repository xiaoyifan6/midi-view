export function clone(data) {
    if (!data)
        return undefined;
    var d = JSON.parse(JSON.stringify(data));
    for (var key in data) {
        if (typeof data[key] === "function") {
            d[key] = data[key];
        }
    }
    return d;
}
export function isString(data) {
    return typeof data === "string";
}
export function isNumber(data) {
    return typeof data === "number";
}
export function isArray(data) {
    return Array.isArray(data);
}
export function isBool(data) {
    return typeof data === "boolean";
}
export function isFunction(data) {
    return typeof data === "function";
}
export function copyCss(cmp, css) {
    if (!cmp || !css)
        return;
    for (var key in css) {
        cmp[key] = css;
    }
}
