import fs from 'fs';
import { join } from 'path';
import Canvas from 'canvas';
import { createOutput } from './functions.js';
import config from '../input/config.json';

// @ts-ignore
Canvas.CanvasRenderingContext2D.prototype.roundRect = function (x: number, y: number, w: number, h: number, r: number, outlineWidth: number = 2) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.lineWidth = outlineWidth;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.stroke();
    this.closePath();
    this.clip();
    return this;
};

async function start() {
    console.log(`[CANVAS INFO] Working...`);
    const images = fs.readdirSync(join(__dirname, '..', '..', 'output', 'raw'));

    // Create output dir if not exists
    createOutput();
    
    let i = 0;
    for(const imageName of images) {
        i++;
        console.log(`[CANVAS INFO] Processing\t ${i}/${images.length} (${((i/images.length) * 100).toFixed(0)}%)\t [TIER 5]`);
        const canvas = Canvas.createCanvas(225, 350);
        let ctx = canvas.getContext('2d');

        // Load background
        const background = await Canvas.loadImage(join(__dirname, '..', '..', 'output', 'raw', imageName));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Make thin black border
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();

        // Save image
        fs.writeFileSync(join(__dirname, '..', '..', 'output', 'processed', `${imageName.slice(0, -4)}_5.jpg`), await tier5(canvas, ctx));
    }

    i = 0;
    for(const imageName of images) {
        i++;
        console.log(`[CANVAS INFO] Processing\t ${i}/${images.length} (${((i/images.length) * 100).toFixed(0)}%)\t [TIER 4]`);
        const canvas = Canvas.createCanvas(225, 350);
        let ctx = canvas.getContext('2d');

        // Load background
        const background = await Canvas.loadImage(join(__dirname, '..', '..', 'output', 'raw', imageName));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Make thin black border
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();

        // Save image
        fs.writeFileSync(join(__dirname, '..', '..', 'output', 'processed', `${imageName.slice(0, -4)}_4.jpg`), await tier4(canvas, ctx));
    }

    i = 0;
    for(const imageName of images) {
        i++;
        console.log(`[CANVAS INFO] Processing\t ${i}/${images.length} (${((i/images.length) * 100).toFixed(0)}%)\t [TIER 3]`);
        const canvas = Canvas.createCanvas(225, 350);
        let ctx = canvas.getContext('2d');

        // Load background
        const background = await Canvas.loadImage(join(__dirname, '..', '..', 'output', 'raw', imageName));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Make thin black border
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();

        // Save image
        fs.writeFileSync(join(__dirname, '..', '..', 'output', 'processed', `${imageName.slice(0, -4)}_3.jpg`), await tier3(canvas, ctx));
    }

    i = 0;
    for(const imageName of images) {
        i++;
        console.log(`[CANVAS INFO] Processing\t ${i}/${images.length} (${((i/images.length) * 100).toFixed(0)}%)\t [TIER 2]`);
        const canvas = Canvas.createCanvas(225, 350);
        let ctx = canvas.getContext('2d');

        // Load background
        const background = await Canvas.loadImage(join(__dirname, '..', '..', 'output', 'raw', imageName));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Make thin black border
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();

        // Save image
        fs.writeFileSync(join(__dirname, '..', '..', 'output', 'processed', `${imageName.slice(0, -4)}_2.jpg`), await tier2(canvas, ctx));
    }

    i = 0;
    for(const imageName of images) {
        i++;
        console.log(`[CANVAS INFO] Processing\t ${i}/${images.length} (${((i/images.length) * 100).toFixed(0)}%)\t [TIER 1]`);
        const canvas = Canvas.createCanvas(225, 350);
        let ctx = canvas.getContext('2d');

        // Load background
        const background = await Canvas.loadImage(join(__dirname, '..', '..', 'output', 'raw', imageName));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Make thin black border
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();

        // Save image
        fs.writeFileSync(join(__dirname, '..', '..', 'output', 'processed', `${imageName.slice(0, -4)}_1.jpg`), await tier1(canvas, ctx));
    }
}

async function tier5(canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D): Promise<Buffer> {
    const star = await Canvas.loadImage(join(__dirname, '..', '..', 'input', config.canvasRenderer.iconToUse));
    ctx.drawImage(star, ((canvas.width - 35) / 2) + (30 * 2), canvas.height - (35 + 20), 35, 35);
    ctx.drawImage(star, ((canvas.width - 35) / 2) - (30 * 2), canvas.height - (35 + 20), 35, 35);
    ctx.drawImage(star, ((canvas.width - 41) / 2) + 32, canvas.height - (41 + 10), 41, 41);
    ctx.drawImage(star, ((canvas.width - 41) / 2) - 32, canvas.height - (41 + 10), 41, 41);
    ctx.drawImage(star, (canvas.width - 47) / 2, canvas.height - (47 + 5), 47, 47);

    return canvas.toBuffer('image/jpeg');
}

async function tier4(canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D): Promise<Buffer> {
    const star = await Canvas.loadImage(join(__dirname, '..', '..', 'input', config.canvasRenderer.iconToUse));
    ctx.drawImage(star, ((canvas.width - 41) / 2) + (24 * 2), canvas.height - (41 + 15), 41, 41);
    ctx.drawImage(star, ((canvas.width - 41) / 2) - (24 * 2), canvas.height - (41 + 15), 41, 41);
    ctx.drawImage(star, ((canvas.width - 47) / 2) + 20, canvas.height - (47 + 5), 47, 47);
    ctx.drawImage(star, ((canvas.width - 47) / 2) - 20, canvas.height - (47 + 5), 47, 47);

    return canvas.toBuffer('image/jpeg');
}

async function tier3(canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D): Promise<Buffer> {
    const star = await Canvas.loadImage(join(__dirname, '..', '..', 'input', config.canvasRenderer.iconToUse));
    ctx.drawImage(star, ((canvas.width - 41) / 2) + 32, canvas.height - (41 + 15), 41, 41);
    ctx.drawImage(star, ((canvas.width - 41) / 2) - 32, canvas.height - (41 + 15), 41, 41);
    ctx.drawImage(star, (canvas.width - 47) / 2, canvas.height - (47 + 5), 47, 47);

    return canvas.toBuffer('image/jpeg');
}

async function tier2(canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D): Promise<Buffer> {
    const star = await Canvas.loadImage(join(__dirname, '..', '..', 'input', config.canvasRenderer.iconToUse));
    ctx.drawImage(star, ((canvas.width - 47) / 2) + 20, canvas.height - (47 + 5), 47, 47);
    ctx.drawImage(star, ((canvas.width - 47) / 2) - 20, canvas.height - (47 + 5), 47, 47);

    return canvas.toBuffer('image/jpeg');
}

async function tier1(canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D): Promise<Buffer> {
    const star = await Canvas.loadImage(join(__dirname, '..', '..', 'input', config.canvasRenderer.iconToUse));
    ctx.drawImage(star, (canvas.width - 41) / 2, canvas.height - (41 + 5), 41, 41);

    return canvas.toBuffer('image/jpeg');
}

start();