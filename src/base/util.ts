
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

export function isString(data: any) {
    return typeof data === "string";
}

export function isNumber(data: any) {
    return typeof data === "number";
}

export function isArray(data: any) {
    return Array.isArray(data);
}

export function isBool(data: any) {
    return typeof data === "boolean";
}

export function isFunction(data: any) {
    return typeof data === "function";
}

export type Css = {
    height?: number
    width?: number

    x?: number
    y?: number

    bgColor?: number
    lineWidth?: number
    lineColor?: string
    borderWidth?: number
    borderColor?: string
    font?: string
    dw?: number

    itemHeight?: number
    itemWidth?: number

    paddingLeft?: number
    paddingRight?: number
    paddingTop?: number
    paddingBottom?: number

    marginLeft?: number
    marginRight?: number
    marginTop?: number
    marginBottom?: number

    scaleX?: number
    scaleY?: number

    padding?: number
    margin?: number

    alpha?: number
    visable?: boolean
    disabled?: boolean

    textColor?: string
}

export function copyCss(cmp: any, css: Css) {
    if (!cmp || !css) return;
    for (var key in css) {
        cmp[key] = css;
    }
}