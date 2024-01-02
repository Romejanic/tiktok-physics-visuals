import c from "canvas";
import { TWO_PI } from "./math";

export type Context2D = CanvasRenderingContext2D | c.CanvasRenderingContext2D;
export type Canvas    = HTMLCanvasElement | c.Canvas;

export default class Graphics {

    private readonly canvas: Canvas;
    private readonly ctx: Context2D;
    private width: number;
    private height: number;

    private _strokeSize = 10;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as Context2D;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    clear(bgColor: string) {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    fillColor(color: string) {
        this.ctx.fillStyle = color;
    }

    strokeColor(color: string) {
        this.ctx.strokeStyle = `${this._strokeSize} solid ${color}`;
    }

    strokeSize(size: number) {
        this._strokeSize = size;
    }

    rect(x: number, y: number, w: number, h: number, stroke = false) {
        this.ctx.fillRect(x, y, w, h);
        if(stroke) this.ctx.strokeRect(x, y, w, h);
    }

    circle(x: number, y: number, r: number, stroke = false) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, TWO_PI);
        this.ctx.fill();
        if(stroke) this.ctx.stroke();
    }

    line(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

}
