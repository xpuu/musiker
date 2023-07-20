import { findJSON } from '$lib/findJSON.js'
import { json } from '@sveltejs/kit'
import wretch from 'wretch'
import _ from 'lodash'

export async function GET({ url: { searchParams } }) {
  let id = searchParams.get('id')
  let html = await wretch(`https://www.youtube.com/watch?v=${id}`)
    .headers({ 'accept-language': 'en' })
    .get()
    .text()
  let data = findJSON(html, 'videoDescriptionMusicSectionRenderer')
  let result = _.get(data, 'carouselLockups.0.carouselLockupRenderer.infoRows')
    .map(v => v.infoRowRenderer)
    .map(v => {
      return [
        _.get(v, 'title.simpleText').toLowerCase(),
        _.get(v, 'defaultMetadata.runs.0.text') ||
          _.get(v, 'defaultMetadata.simpleText') ||
          _.get(v, 'expandedMetadata.simpleText'),
      ]
    })
  return json(Object.fromEntries(result))
}
