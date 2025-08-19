// import { createCanvas } from 'canvas'
/**
 * @vitest-environment node
 */
import fs from 'node:fs'
import * as fabric from 'fabric/node'

describe('ssr', () => {
  it('should ', async () => {
    const canvas = new fabric.Canvas(null, { width: 100, height: 100 })
    const text = new fabric.FabricText('test', {
      fill: 'blue',
      fontSize: 24,
    })
    canvas.add(text)
    canvas.centerObject(text)
    canvas.renderAll()
    const out = fs.createWriteStream(`${import.meta.dirname}/output.png`)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    await new Promise((resolve) => {
      out.on('finish', () => {
        console.log('PNG 文件已生成: output.png')
        resolve(undefined)
      })
    })
  })
})
