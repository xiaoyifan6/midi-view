import { base } from "../base/base"
import { ListView, HeadInfoItem } from "./item";
import { config } from "../constant/config"
import { Style } from "../constant/theme";

export class Left extends base.Component {
    public lineWidth: number = 0.4;
    public lineColor: string = "#000000";
    public listView: ListView;

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super(x, y, width, height);
        this.borderWith = 0;
        this.listView = new ListView(this, [], config.ui.left.listView.itemHeight)
            .cbk(() => new HeadInfoItem());
    }

    public setStyle(style: Style) {
        super.setStyle(style);
        if (!style) return;
        if (style.lineColor) {
            this.lineColor = style.lineColor;
        }
    }

    public setData(data: Array<any>) {
        this.listView.setData(data);
        this.listView.offsetY = 0;
        this.listView.refresh();
    }

    public onResize() {
        this.listView.refresh();
        super.onResize();
    }
}