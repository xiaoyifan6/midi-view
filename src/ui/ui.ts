import { base } from "../base/base"
import { Header } from "./header"
import { Body } from "./body"
import { Left } from "./left";
import { event } from "../base/event"
import { config } from "../constant/config";
import { Style, Theme } from "../constant/theme";

export class UI extends base.BaseUI {
    public hearder: Header;
    public left: Left;
    public body: Body;

    private headHeight: number;
    private leftWidth: number;

    public constructor(container: base.Component, theme: Theme, headHeight: number = config.ui.headHeight, leftWidth: number = config.ui.leftWidth) {
        super(container, theme);
        this.headHeight = headHeight;
        this.leftWidth = leftWidth;

        this.hearder = new Header(leftWidth, 0, container.width - leftWidth, headHeight);
        this.left = new Left(0, headHeight, leftWidth, container.height - headHeight);
        this.body = new Body(leftWidth, headHeight, container.width - leftWidth, container.height - headHeight);

        this.hearder.borderWith = config.ui.hearder.borderWith;
        this.hearder.dw = this.body.dw;
        this.left.borderWith = config.ui.left.borderWith;
        this.body.borderWith = 0;

        container.addChild(this.body);
        container.addChild(this.hearder);
        container.addChild(this.left);
        this.bind();

        this.setTheme(theme);
    }

    public bind() {
        var self = this;
        var cbk = (eobj: event.EventObject) => {
            let dy = eobj.data.detailY;// eobj.p.y - eobj.op.y;
            let dx = eobj.data.detailX;//eobj.p.x - eobj.op.x;
            // dx *= 0.2;

            if (self.body.listView.offsetY + dy <= 0 && self.body.listView.offsetY + self.body.listView.contentHeight + dy >= self.body.height) {
                self.body.listView.offsetY += dy;
                self.left.listView.offsetY += dy;
                self.body.listView.refresh();
                self.left.listView.refresh();
            }

            if (eobj.target === self.body && self.body.offsetX + dx <= 0 && self.body.offsetX + self.body.contentWidth + dx >= self.body.width) {
                self.body.listView.offsetX += dx;
                self.body.offsetX = self.body.listView.offsetX;
                self.hearder.offsetX += dx;
                self.body.listView.refresh();
            }
        }
        event.bind(event.TOUCH_MOVE, cbk, this.body);
        event.bind(event.TOUCH_MOVE, cbk, this.left);

        var cbk = (eobj: event.EventObject) => {
            let dy = eobj.data.detailY;// eobj.p.y - eobj.op.y;
            let dx = eobj.data.detailX;//eobj.p.x - eobj.op.x;

            if (self.body.listView.itemHeight + dy >= 40 && self.body.listView.itemHeight + dy <= self.body.height / 2) {
                self.body.listView.itemHeight += dy;
                self.left.listView.itemHeight += dy;
                self.body.listView.offsetY = 0;
                self.left.listView.offsetY = 0;
                self.body.listView.refresh();
                self.left.listView.refresh();
            }

            if (self.body.dw + dx >= 8 && (self.body.dw + dx) * self.body.bpm <= 240) {
                // self.body.dw2 += dx;

                self.body.dw += dx;
                self.hearder.dw += dx;

                for (var i in self.body.listView.views) {
                    self.body.listView.views[i]["dw"] = self.body.dw * self.body.bpm;
                }
                self.body.offsetX = 0;
                self.hearder.offsetX = 0;
                self.body.listView.offsetX = 0;
                self.body.listView.refresh();
            }
        };

        event.bind(event.TOUCH_SCALE, cbk, this.body);

        var cbk2 = (eobj: event.EventObject) => {
            var x = Math.floor((eobj.data.x - self.body.offsetX - self.body.left) / self.hearder.dw);
            self.body.position = x;
            self.hearder.position = x;
        }
        event.bind(event.TOUCH, cbk2, this.hearder);

        var cbk2 = (eobj: event.EventObject) => {
            self.body.listView.hit(eobj.data.x, eobj.data.y)
        }
        event.bind(event.TOUCH, cbk2, this.body);
    }


    public setData(data: any) {
        super.setData(data);
        var bpm = config.DEFAULT_BMP;
        var ppq = 4;
        if (this.data["header"]) {
            // if (this.data["header"]["ppq"]) {
            //     ppq = this.data["header"]["ppq"] / 24;
            // }
            if (this.data["header"]["tempos"] && this.data["header"]["tempos"][0]) {
                bpm = 60 / (this.data["header"]["tempos"][0]["bpm"] || config.DEFAULT_TEMPOS) * ppq;
            }
        }

        this.body.bpm = bpm;
        this.hearder.bpm = bpm;

        this.body.duration = this.data["duration"] || 0
        this.body.setData(this.data.tracks)
        this.left.setData(this.data.tracks)

        this.hearder.offsetX = 0;
        this.hearder.dw = this.body.dw = 8;
        for (var i in this.body.listView.views) {
            this.body.listView.views[i]["dw"] = this.body.dw * this.body.bpm;
        }
        this.hearder.position = this.body.position;
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.refresh();
    }

    public refresh() {
        this.hearder.set(this.leftWidth, 0, this.container.width - this.leftWidth, this.headHeight);
        this.left.set(0, this.headHeight, this.leftWidth, this.container.height - this.headHeight);
        this.body.set(this.leftWidth, this.headHeight, this.container.width - this.leftWidth, this.container.height - this.headHeight);
    }

    public set position(p: number) {
        this.body.position = p;
        this.hearder.position = this.body.position;
    }

    public hide() {
        super.hide();
        this.body.visible = false;
        this.hearder.visible = false;
        this.left.visible = false;
    }

    public show() {
        super.show();
        this.body.visible = true;
        this.hearder.visible = true;
        this.left.visible = true;
    }

    public setTheme(theme: Theme) {
        super.setTheme(theme);

        this.body.setStyle(theme.ui.body);
        this.left.setStyle(theme.ui.left);
        this.hearder.setStyle(theme.ui.header);
        this.body.listView.setStyle(theme.ui.body.item);
        this.left.listView.setStyle(theme.ui.left.item);
    }
}