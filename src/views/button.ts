import { Label } from "./label"
import { event } from "../base/event"

export class Button extends Label {
    public offsetX: number = 4;
    public offsetY: number = 4;

    private ox: number = 0;
    private oy: number = 0;

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super(x, y, width, height);
        event.bind(event.TOUCH_DOWN, this.onDown, this);
        // event.bind(event.TOUCH_UP, this.onUp, this);
    }

    public onDown(eobj: event.EventObject) {
        this.ox = this.x;
        this.oy = this.y;
        this.x += this.offsetX;
        this.y += this.offsetY;

        setTimeout(() => {
            this.x = this.ox;
            this.y = this.oy;
        }, 500);
    }

    public onDettach() {
        super.onDettach();
        event.cancel(event.TOUCH_DOWN, this.onDown, this);
        // event.cancel(event.TOUCH_UP, this.onUp, this);
    }
}