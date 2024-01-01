import { createCanvas } from "canvas";
import { createWriteStream } from "fs";

const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

ctx.textAlign = "center";
ctx.font = "30px Arial";
ctx.fillStyle = "black";
ctx.fillText("Canvas on Node", canvas.width/2, canvas.height/2);

const out = createWriteStream("out.png");
canvas.createPNGStream().pipe(out);
