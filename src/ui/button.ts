import { base } from "../base/rect"

export class Button extends base.Component {

    public offsetX: number = 4;
    public offsetY: number = 4;
    public status: number = 0; // 0: normal, 1: down, 2: up

    public text: string = "ok";
    public textColor = "#000000";

    public onDraw(context: CanvasRenderingContext2D) {
        if (!this.parent) return

        context.beginPath();

        context.stroke();
    }

}