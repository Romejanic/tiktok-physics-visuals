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
    private _scaleFactor = 1.0;

    constructor(canvas: Canvas, scaleFactor = 1.0) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as Context2D;
        this.width = canvas.width;
        this.height = canvas.height;
        this._scaleFactor = scaleFactor;
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
        const size = Math.round(this._strokeSize * this._scaleFactor);
        this.ctx.strokeStyle = `${size}px solid ${color}`;
    }

    strokeSize(size: number) {
        this._strokeSize = size;
        this.ctx.lineWidth = size * this._scaleFactor;
    }

    rect(x: number, y: number, w: number, h: number, stroke = false) {
        this.ctx.fillRect(x * this._scaleFactor, y * this._scaleFactor, w * this._scaleFactor, h * this._scaleFactor);
        if(stroke) this.ctx.strokeRect(x * this._scaleFactor, y * this._scaleFactor, w * this._scaleFactor, h * this._scaleFactor);
    }

    circle(x: number, y: number, r: number, stroke = false) {
        this.ctx.beginPath();
        this.ctx.arc(x * this._scaleFactor, y * this._scaleFactor, r * this._scaleFactor, 0, TWO_PI);
        this.ctx.fill();
        if(stroke) this.ctx.stroke();
    }

    line(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1 * this._scaleFactor, y1 * this._scaleFactor);
        this.ctx.lineTo(x2 * this._scaleFactor, y2 * this._scaleFactor);
        this.ctx.stroke();
    }

}
