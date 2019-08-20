
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

/**
 * 
 * @param cxt 绘制圆角矩形
 * @param x 
 * @param y 
 * @param width 
 * @param height 
 * @param radius 
 */
export function drawRoundRect(cxt: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number, radius: number) {
    cxt.beginPath();
    cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
    cxt.lineTo(width - radius + x, y);
    cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
    cxt.lineTo(width + x, height + y - radius);
    cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
    cxt.lineTo(radius + x, height + y);
    cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
    cxt.closePath();
}