import {writeFileSync} from 'fs'
import {join} from 'path'
import Canvas from 'canvas'
import {getReadableTime} from 'quick-ms/lib'

// @ts-ignore
Canvas.CanvasRenderingContext2D.prototype.roundRect = function (x: number, y: number, w: number, h: number, r: number, outlineWidth: number = 2) {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  this.lineWidth = outlineWidth
  this.beginPath()
  this.moveTo(x + r, y)
  this.arcTo(x + w, y, x + w, y + h, r)
  this.arcTo(x + w, y + h, x, y + h, r)
  this.arcTo(x, y + h, x, y, r)
  this.arcTo(x, y, x + w, y, r)
  this.stroke()
  this.closePath()
  this.clip()
  return this
}

const noDuplicates: number[] = require('../output/processed.json')
const waifus = require('../output/waifus.json')

async function start() {
  console.log('[Main] [Info] Processing images...')
  let i = 0

  for (const waifu of waifus) {
    if (!noDuplicates.includes(waifu.id)) {
      i++
      console.log(`[Main] [Info] Processing images of ${waifu.forename}... [${i}/${waifus.length}]`)
      const now = Date.now()

      for (let j = 1; j < waifu.images + 1; j++) {
        for (let k = 1; k < 6; k++) {
          const canvas = Canvas.createCanvas(225, 350)
          let ctx = canvas.getContext('2d')

          // Load raw image (background)
          const background = await Canvas.loadImage(join(__dirname, '..', 'output', 'raw', `${waifu.id}_${j}.jpg`))
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

          // Make thin black border
          ctx.lineWidth = 8
          ctx.beginPath()
          ctx.rect(0, 0, canvas.width, canvas.height)
          ctx.stroke()

          // Save image
          writeFileSync(join(__dirname, '..', 'output', 'finished', `tier_${k}`, `${waifu.id}_${j}.jpg`), await drawTier(canvas, ctx, k))
        }
      }

      console.log(`» Finished processing all images of ${waifu.forename}.`)
      noDuplicates.push(waifu.id)
    }
  }

  console.log('[Main] [Info] Saving processed ids to json file...')
  const data = JSON.stringify(noDuplicates, null, 2)
  writeFileSync(join(__dirname, '..', 'output', 'processed.json'), data)

  console.log('[Main] [Info] Finished!')
  process.exit()
}

async function drawTier(canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D, tier: number): Promise<Buffer> {
  const star = await Canvas.loadImage(join(__dirname, '..', 'input', 'star.png'))

  switch (tier) {
    case 1: {
      ctx.drawImage(star, (canvas.width - 41) / 2, canvas.height - (41 + 5), 41, 41)
      break
    }
    case 2: {
      ctx.drawImage(star, (canvas.width - 47) / 2 + 20, canvas.height - (47 + 5), 47, 47)
      ctx.drawImage(star, (canvas.width - 47) / 2 - 20, canvas.height - (47 + 5), 47, 47)
      break
    }
    case 3: {
      ctx.drawImage(star, (canvas.width - 41) / 2 + 32, canvas.height - (41 + 15), 41, 41)
      ctx.drawImage(star, (canvas.width - 41) / 2 - 32, canvas.height - (41 + 15), 41, 41)
      ctx.drawImage(star, (canvas.width - 47) / 2, canvas.height - (47 + 5), 47, 47)
      break
    }
    case 4: {
      ctx.drawImage(star, (canvas.width - 41) / 2 + 24 * 2, canvas.height - (41 + 15), 41, 41)
      ctx.drawImage(star, (canvas.width - 41) / 2 - 24 * 2, canvas.height - (41 + 15), 41, 41)
      ctx.drawImage(star, (canvas.width - 47) / 2 + 20, canvas.height - (47 + 5), 47, 47)
      ctx.drawImage(star, (canvas.width - 47) / 2 - 20, canvas.height - (47 + 5), 47, 47)
      break
    }
    case 5: {
      ctx.drawImage(star, (canvas.width - 35) / 2 + 30 * 2, canvas.height - (35 + 20), 35, 35)
      ctx.drawImage(star, (canvas.width - 35) / 2 - 30 * 2, canvas.height - (35 + 20), 35, 35)
      ctx.drawImage(star, (canvas.width - 41) / 2 + 32, canvas.height - (41 + 10), 41, 41)
      ctx.drawImage(star, (canvas.width - 41) / 2 - 32, canvas.height - (41 + 10), 41, 41)
      ctx.drawImage(star, (canvas.width - 47) / 2, canvas.height - (47 + 5), 47, 47)
      break
    }
  }

  return canvas.toBuffer('image/jpeg')
}

start()
