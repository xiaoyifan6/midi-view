import { base } from "../base/rect"
import { Header } from "./header"
import { Body } from "./body"
import { Left } from "./left";
import { Event, EventObject } from "../base/event"

export class UI {
    public hearder: Header;
    public left: Left;
    public body: Body;
    private container: base.Component;

    private headHeight: number;
    private leftWidth: number;

    public constructor(container: base.Component, headHeight: number = 40, leftWidth: number = 80) {
        this.container = container;
        this.headHeight = headHeight;
        this.leftWidth = leftWidth;

        this.hearder = new Header(leftWidth, 0, container.width - leftWidth, headHeight);
        this.left = new Left(0, headHeight, leftWidth, container.height - headHeight);
        this.body = new Body(leftWidth, headHeight, container.width - leftWidth, container.height - headHeight);


        this.hearder.borderWith = 1;
        this.hearder.dw = this.body.dw;
        this.left.borderWith = 1;
        this.body.borderWith = 0;

        container.addChild(this.body);
        container.addChild(this.hearder);
        container.addChild(this.left);
        this.bind();
    }

    public bind() {
        var self = this;
        var cbk = (eobj: EventObject, obj: base.Component) => {
            let dy = eobj.detailY;// eobj.p.y - eobj.op.y;
            let dx = eobj.detailX;//eobj.p.x - eobj.op.x;
            // dx *= 0.2;

            if (self.body.listView.offsetY + dy <= 0 && self.body.listView.offsetY + self.body.listView.contentHeight + dy >= self.body.height) {
                self.body.listView.offsetY += dy;
                self.left.listView.offsetY += dy;
                self.body.listView.refresh();
                self.left.listView.refresh();
            }

            if (obj === self.body && self.body.offsetX + dx <= 0 && self.body.offsetX + self.body.contentWidth + dx >= self.body.width) {
                self.body.listView.offsetX += dx;
                self.body.offsetX = self.body.listView.offsetX;
                self.hearder.offsetX += dx;
                self.body.listView.refresh();
            }
        }
        Event.bindDrag(cbk, this.body);
        Event.bindDrag(cbk, this.left);

        var cbk = (eobj: EventObject, obj: base.Component) => {
            let dy = eobj.detailY;// eobj.p.y - eobj.op.y;
            let dx = eobj.detailX;//eobj.p.x - eobj.op.x;

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

        Event.bindScale(cbk, this.body);

        var cbk2 = (eobj: EventObject, obj: base.Component) => {
            var x = Math.floor((eobj.detailX - self.body.offsetX - self.body.left) / self.hearder.dw);
            self.body.position = x;
            self.hearder.position = x;
        }

        Event.bindClick(cbk2, this.hearder);
    }

    public refresh() {
        this.hearder.set(this.leftWidth, 0, this.container.width - this.leftWidth, this.headHeight);
        this.left.set(0, this.headHeight, this.leftWidth, this.container.height - this.headHeight);
        this.body.set(this.leftWidth, this.headHeight, this.container.width - this.leftWidth, this.container.height - this.headHeight);
    }
}