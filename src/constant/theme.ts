import { Color } from "./color";

// doc: http://tool.oschina.net/commons?type=3

export interface Style {
    borderColor: string,
    lineColor?: string,
    textColor?: string,
    indexColor?: string,

    blackColor?: string,
    whiteColor?: string,

    barColor?: string,
    hitColor?: string,
    bgBarColor?: string,
    blockColor?: string,

    bgColor: string,
}

export interface StyleItem extends Style {
    item: Style
}

export interface ThemeUI {
    body: StyleItem,
    header: Style,
    left: StyleItem,
}

export interface ThemeDUI {
    body: Style,
    header: Style,
    left: Style,
    closeBtn: Style,
}

export interface Theme {
    DEFAULT_BG_COLOR: string,
    DEFAULT_BORDER_COLOR: string,
    style: Style,
    ui: ThemeUI,
    dui: ThemeDUI,
    name: string
}


var defaultTheme: Theme = {
    DEFAULT_BG_COLOR: Color.WHITE,
    DEFAULT_BORDER_COLOR: Color.BLACK,
    style: {
        borderColor: Color.BLACK,
        bgColor: Color.WHITE,
    },
    name: "default",
    ui: {
        body: {
            borderColor: Color.BLACK,
            bgColor: Color.WHITE,
            barColor: Color.BLACK,
            indexColor: Color.RED,
            bgBarColor: Color.WHITE,
            lineColor: Color.BLACK,
            item: {
                borderColor: Color.BLACK,
                bgColor: Color.WHITE,
                textColor: Color.BLACK,
                lineColor: Color.BLACK
            }
        },
        header: {
            borderColor: Color.BLACK,
            bgColor: Color.WHITE,
            textColor: Color.BLACK,
            indexColor: Color.RED,
            lineColor: Color.BLACK,
        },
        left: {
            borderColor: Color.BLACK,
            bgColor: Color.WHITE,
            item: {
                borderColor: Color.BLACK,
                bgColor: Color.WHITE,
                textColor: Color.BLACK,
            }
        },
    },
    dui: {
        body: {
            borderColor: Color.BLACK,
            bgColor: Color.WHITE,
            barColor: Color.BLACK,
            indexColor: Color.RED,
            bgBarColor: Color.WHITE,
            blockColor: Color.BLACK,
            lineColor: Color.GREY21,
        },
        header: {
            borderColor: Color.BLACK,
            bgColor: Color.WHITE,
            textColor: Color.BLACK,
            indexColor: Color.RED,
            lineColor: Color.BLACK,
            hitColor: Color.RED,
        },
        left: {
            borderColor: Color.BLACK,
            bgColor: Color.WHITE,
            textColor: Color.BLACK,
            blackColor: Color.BLACK,
            whiteColor: Color.WHITE,
            hitColor: Color.RED,
        },
        closeBtn: {
            borderColor: Color.BLACK,
            bgColor: Color.WHITE,
            textColor: Color.BLACK,
        }
    }
}

var blueTheme: Theme = {
    DEFAULT_BG_COLOR: Color.WHITE,
    DEFAULT_BORDER_COLOR: Color.BLACK,
    style: {
        borderColor: Color.WHITE,
        bgColor: Color.LIGHTSKYBLUE4,
    },
    name: "blue",
    ui: {
        body: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.SLATEGREY,
            barColor: Color.SLATEGRAY3,
            indexColor: Color.DARKORANGE1,
            bgBarColor: Color.LIGHTSTEELBLUE1,
            lineColor: Color.GAINSBORO,
            item: {
                borderColor: Color.LIGHTSTEELBLUE1,
                bgColor: Color.SLATEGREY,
                textColor: Color.WHITE,
                lineColor: Color.GAINSBORO
            }
        },
        header: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.LIGHTSKYBLUE4,
            textColor: Color.WHITE,
            indexColor: Color.DARKORANGE1,
            lineColor: Color.WHITE,
        },
        left: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.LIGHTSKYBLUE4,
            item: {
                borderColor: Color.LIGHTSTEELBLUE1,
                bgColor: Color.LIGHTSKYBLUE4,
                textColor: Color.WHITE,
            }
        },
    },
    dui: {
        body: {
            borderColor: Color.BLACK,
            bgColor: Color.SLATEGREY,
            barColor: Color.SLATEGRAY3,
            indexColor: Color.DARKORANGE1,
            bgBarColor: Color.LIGHTSTEELBLUE1,
            lineColor: Color.GAINSBORO,
            blockColor: Color.LIGHTCYAN,
            hitColor: Color.POWDERBLUE,
        },
        header: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.LIGHTSKYBLUE4,
            textColor: Color.WHITE,
            indexColor: Color.DARKORANGE1,
            lineColor: Color.WHITE,
        },
        left: {
            borderColor: Color.BLACK,
            bgColor: Color.GAINSBORO,
            textColor: Color.BLACK,
            blackColor: Color.BLACK,
            whiteColor: Color.GAINSBORO,
            hitColor: Color.POWDERBLUE,
            indexColor: Color.DARKSLATEGRAY,
        },
        closeBtn: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.LIGHTSKYBLUE4,
            textColor: Color.GAINSBORO,
        }
    }
}

var blackTheme: Theme = {
    DEFAULT_BG_COLOR: Color.WHITE,
    DEFAULT_BORDER_COLOR: Color.BLACK,
    style: {
        borderColor: Color.WHITE,
        bgColor: Color.GREY11,
    },
    name: "black",
    ui: {
        body: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.GREY21,
            barColor: Color.GREY51,
            indexColor: Color.GREEN,
            bgBarColor: Color.GRAY81,
            lineColor: Color.GAINSBORO,
            item: {
                borderColor: Color.GRAY91,
                bgColor: Color.GREY21,
                textColor: Color.WHITE,
                lineColor: Color.GAINSBORO
            }
        },
        header: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.GREY11,
            textColor: Color.GRAY91,
            indexColor: Color.GREEN,
            lineColor: Color.WHITE,
        },
        left: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.GREY11,
            item: {
                borderColor: Color.GAINSBORO,
                bgColor: Color.GREY11,
                textColor: Color.GRAY91,
            }
        },
    },
    dui: {
        body: {
            borderColor: Color.BLACK,
            bgColor: Color.GREY21,
            barColor: Color.GREY51,
            indexColor: Color.GREEN,
            bgBarColor: Color.GRAY81,
            lineColor: Color.GAINSBORO,
            blockColor: Color.GRAY81,
            hitColor: Color.GREEN4,
        },
        header: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.GREY11,
            textColor: Color.WHITE,
            indexColor: Color.GREEN,
            lineColor: Color.WHITE,
        },
        left: {
            borderColor: Color.BLACK,
            bgColor: Color.GAINSBORO,
            textColor: Color.BLACK,
            blackColor: Color.BLACK,
            whiteColor: Color.GAINSBORO,
            hitColor: Color.GREEN4,
            indexColor: Color.GREEN4,
        },
        closeBtn: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.LIGHTSKYBLUE4,
            textColor: Color.GAINSBORO,
        }
    }
}

var lightTheme: Theme = {
    DEFAULT_BG_COLOR: Color.WHITE,
    DEFAULT_BORDER_COLOR: Color.BLACK,
    style: {
        borderColor: Color.GAINSBORO,
        bgColor: Color.WHITE,
    },
    name: "light",
    ui: {
        body: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.WHITE,
            barColor: Color.GRAY81,
            indexColor: Color.BLUE1,
            bgBarColor: Color.WHITE,
            lineColor: Color.GAINSBORO,
            item: {
                borderColor: Color.GRAY91,
                bgColor: Color.WHITE,
                textColor: Color.ROYALBLUE1,
                lineColor: Color.GREY61
            }
        },
        header: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.WHITE,
            textColor: Color.GREY51,
            indexColor: Color.BLUE1,
            lineColor: Color.GAINSBORO,
        },
        left: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.WHITE,
            item: {
                borderColor: Color.GAINSBORO,
                bgColor: Color.WHITE,
                textColor: Color.GREY51,
            }
        },
    },
    dui: {
        body: {
            borderColor: Color.BLACK,
            bgColor: Color.WHITE,
            barColor: Color.GRAY81,
            indexColor: Color.BLUE1,
            bgBarColor: Color.WHITE,
            lineColor: Color.GAINSBORO,
            blockColor: Color.GREY61,
            hitColor: Color.LIGHTSTEELBLUE,
        },
        header: {
            borderColor: Color.GAINSBORO,
            bgColor: Color.WHITE,
            textColor: Color.GREY51,
            indexColor: Color.BLUE1,
            lineColor: Color.GAINSBORO,
        },
        left: {
            borderColor: Color.GREY61,
            bgColor: Color.WHITE,
            textColor: Color.ROYALBLUE1,
            blackColor: Color.GREY31,
            whiteColor: Color.GAINSBORO,
            hitColor: Color.LIGHTSTEELBLUE,
            indexColor: Color.STEELBLUE,
        },
        closeBtn: {
            borderColor: Color.GREY51,
            bgColor: Color.ALICEBLUE,
            textColor: Color.GREY51,
        }
    }
}

export var theme = {
    cur: defaultTheme,
}

export var ThemeConfig = {
    default: defaultTheme,
    blue: blueTheme,
    black: blackTheme,
    light: lightTheme
}