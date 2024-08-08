'use client'
import { centerCrop, makeAspectCrop } from 'react-image-crop'

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export async function getCroppedImageBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/png'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas is empty'))
        }
      },
      `${type}`,
      0.5
    )
  })
}

export async function createBlob(
  imgRef,
  previewCanvasRef,
  completedCrop,
  type
) {
  const image = imgRef.current
  const previewCanvas = previewCanvasRef.current
  if (!image || !previewCanvas || !completedCrop) {
    throw new Error('Crop canvas does not exist')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const offscreen = document.createElement('canvas')
  offscreen.width = completedCrop.width * scaleX
  offscreen.height = completedCrop.height * scaleY
  const ctx = offscreen.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  ctx.drawImage(
    previewCanvas,
    0,
    0,
    previewCanvas.width,
    previewCanvas.height,
    0,
    0,
    offscreen.width,
    offscreen.height
  )

  return await getCroppedImageBlob(
    offscreen as unknown as HTMLCanvasElement,
    type
  )
}
