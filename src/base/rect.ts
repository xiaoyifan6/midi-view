export namespace base {
    export class Point {
        public x: number;
        public y: number;

        public constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public add(p: Point): Point {
            return new Point(this.x + p.x, this.y + p.y)
        }

        public sub(p: Point): Point {
            return new Point(this.x - p.x, this.y - p.y)
        }

        public multy(p: Point): number {
            return this.x * p.y + this.y * p.x;
        }

        public distance(p: Point): number {
            return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y))
        }

        public clone(): Point {
            return new Point(this.x, this.y);
        }
    }

    export class Rect {
        public x: number;
        public y: number;
        public width: number;
        public height: number;

        public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        public set(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        public get left(): number {
            return this.x;
        }
        public get right(): number {
            return this.x + this.width;
        }
        public get top(): number {
            return this.y;
        }
        public get bottom(): number {
            return this.y + this.height;
        }

        public get centerX(): number {
            return this.left + this.width / 2;
        }

        public get centerY(): number {
            return this.top + this.height / 2;
        }

        public contain(p: Point): boolean {
            return p.x > this.left && p.x < this.right && p.y > this.top && p.y < this.bottom;
        }

        public clone(): Rect {
            return new Rect(this.x, this.y, this.width, this.height);
        }
    }

    export class Component extends Rect {
        public children: Array<Component> = [];
        public bgColor: string = "#ffffff";
        public scaleX: number = 1;
        public scaleY: number = 1;
        public parent?: Component;
        public overflow: boolean = false; // 是否允许溢出
        public active: boolean = false;

        public borderWith: number = 0;
        public borderColor: string = "#000000";

        public release() {
            this.active = false;
        }

        public tryActive(p: Point) {
            if (this.contain(p)) {
                this.active = true;
            }
        }

        public addChild(child: Component, index: number = -1) {
            if (index < 0) {
                index = this.children.length;
            }
            this.children.splice(index, 0, child);
            child.parent = this;
        }

        public removeChildAt(index: number) {
            this.children[index] && (this.children[index].parent = undefined);
            this.children.splice(index, 1);
        }

        public childAt(index: number) {
            return this.children[index];
        }

        public onResize() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i] && this.children[i].onResize();
            }
        }

        protected getScaleX(c: Component = this) {
            return c.scaleX * (c.parent ? c.parent.scaleX : 1);
        }

        protected getScaleY(c: Component = this) {
            return c.scaleY * (c.parent ? c.parent.scaleY : 1);
        }

        public getBound(left: number, top: number, width: number, height: number): Rect {
            return new Rect(left, top, width, height)
        }

        public onDraw(context: CanvasRenderingContext2D) {
            if (this.parent == null) return;

            context.fillStyle = this.bgColor;

            var sx = this.getScaleX(this);
            var sy = this.getScaleX(this);
            var psx = this.getScaleX(this.parent);
            var psy = this.getScaleX(this.parent);

            var left = (this.parent.x + this.x) * psx;
            var top = (this.parent.y + this.y) * psy;
            var width = this.width * sx;
            var height = this.height * sy;

            if (!this.overflow) {
                context.beginPath();
                var bound = this.getBound(left, top, width, height)
                context.rect(bound.left, bound.top, bound.right, bound.bottom);
                context.clip();
            }

            context.fillRect(left, top, width, height);

            for (var i = 0; i < this.children.length; i++) {
                context.save();
                this.children[i] && this.children[i].onDraw(context);
                context.restore();
            }

            if (this.borderWith > 0) {
                context.beginPath();
                context.lineWidth = this.borderWith;
                context.strokeStyle = this.borderColor;
                context.strokeRect(left, top, width, height);
                context.stroke();
            }
        }
    }

}