import { json } from '@sveltejs/kit'
import wretch from 'wretch'
import _get from 'just-safe-get'

import { findJSON } from '$lib/findJSON.js'

type Run = { text: string }
type Meta = { simpleText?: string; runs?: Run[] }

type Scraped = {
  infoRowRenderer: {
    title: { simpleText: string }
    defaultMetadata?: Meta
    expandedMetadata?: Meta
  }
}

export async function GET({ url: { searchParams } }) {
  let id = searchParams.get('id')
  // Scrape
  let html = await wretch(`https://www.youtube.com/watch?v=${id}`)
    .headers({ 'accept-language': 'en' })
    .get()
    .text()
  // Get data
  let data = _get(
    findJSON(html, 'videoDescriptionMusicSectionRenderer'),
    'carouselLockups.0.carouselLockupRenderer.infoRows'
  ) as Scraped[]
  let result = data
    .map(v => v.infoRowRenderer)
    .map(row => {
      let value = ''
      // Key
      const key = _get(row, 'title.simpleText').toLowerCase()
      // I don't really care about licenses
      if (key === 'licenses') return [key, value]
      // Process metadata
      for (let k of ['expandedMetadata', 'defaultMetadata'] as const) {
        if (row[k]) {
          let item = row[k]
          // More values?
          if (item?.runs) {
            value = item.runs
              .map(v => v.text)
              // YouTube is just weird :]
              .filter(v => v.trim() !== ',')
              .join(', ')
            if (value !== '') break
          }
          // Just simpleText
          value = item?.simpleText || ''
        }
      }
      return [key, value]
    })
    // Filter out empty values
    .filter(([k, v]) => Boolean(v))
  // return json({ result: Object.fromEntries(result), data })
  return json(Object.fromEntries(result))
}
