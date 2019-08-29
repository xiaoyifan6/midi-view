import { Color } from "./color";

export var config = {
    DEFAULT_BG_COLOR: Color.WHITE,
    DEFAULT_BORDER_COLOR: Color.BLACK,
    DEFAULT_BORDER_WIDTH: 0,

    BUTTON_DOWN_DELAY: 500,
    BUTTON_OFFSET_X: 4,
    BUTTON_OFFSET_Y: 4,

    LABEL_LINEHEIGHT: 20,
    LABEL_FONT_SIZE: 14,

    DEFAULT_BAR_WIDTH: 4,

    DEFAULT_BMP: 2,
    DEFAULT_TEMPOS: 120,
    TONE_DELAY: 0.5,
    REFRESH_INTERVAL: 100,
    WHELL_RATE: 0.1,

    ui: {
        headHeight: 40,
        leftWidth: 80,
        hearder: {
            dw: 0.01,
            bate: 4,
            borderWith: 1,
            lineWidth: 0.4,
            indexWidth: 0.5,
            textWidth: 0.6,
        },
        left: {
            lineWidth: 0.4,
            borderWith: 1,
            listView: {
                itemHeight: 60,
                item: {
                    textWidth: 0.8
                }
            }
        },
        body: {
            dw: 0.1,
            paddingRight: 40,
            bate: 4,
            lineWidth: 0.4,
            indexWidth: 0.5,
            listView: {
                height: 60,
                scrollBarWidth: 0,
                itemHeight: 60,
                item: {
                    textWidth: 0.5,
                }
            }
        }
    },
    dui: {
        headHeight: 40,
        leftWidth: 70,
        toneDelay: 0.1,
        hearder: {
            dw: 8,
            bate: 4,
            lineWidth: 0.4,
            indexWidth: 0.5,
            borderWith: 1,
            textWidth: 0.6,
        },
        left: {
            lineWidth: 1,
            borderWith: 1,
        },
        body: {
            dh: 8,
            dw: 0.2,
            indexWidth: 0.5,
            lineWidth: 0.5,
            paddingRight: 10,
        },
        closeBtn: {
            x: 10,
            y: 10,
            width: 40,
            height: 20,
            borderWith: 0.8,
            radius: 5
        }
    }
}

