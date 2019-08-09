
export function clone(data: any) {
    if (!data) return undefined;
    var d = JSON.parse(JSON.stringify(data));
    for (var key in data) {
        if (typeof data[key] === "function") {
            d[key] = data[key];
        }
    }
    return d;
}