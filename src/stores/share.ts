import { derived, get, writable } from 'svelte/store'
import _debounce from 'just-debounce-it'
import _pick from 'just-pick'

import { browser } from '$app/environment'
import { durationFmt } from '~/lib/utils'
import { api } from '$lib/api'

// ---- Youtube

type Yres = {
  snippet: {
    title: string
    description: string
    tags: string[]
  }
  contentDetails: {
    duration: string
  }
}

type Ylist = {
  items: Yres[]
  pageInfo: {
    totalResults: number
  }
}

type Ydata = {
  title: string
  description: string
  tags: string[]
  duration: string
}

type Ymeta = {
  song: string
  artist: string
  album: string
  writers: string
}

const ytApiKey = 'AIzaSyBC6L5olrntP15e_KUP0r7ax_ye2VRyU4w'

// Video id
export const id = writable('')
id.subscribe(doGetData)
// Youtube result
export const ylist = writable<Ylist>()

// Youtube video
export const ydata = derived(ylist, $ylist =>
  $ylist?.pageInfo.totalResults
    ? ({
        // Flatten
        ..._pick($ylist.items[0].snippet, ['title', 'description', 'tags']),
        duration: durationFmt($ylist.items[0].contentDetails.duration),
      } as Ydata)
    : null
)

// Scraped metadata
export const ymeta = writable<Ymeta>()

// Get data from youtube API and youtube scraper
async function doGetData($id: string) {
  console.log('doGetData', $id)
  if (!browser || !$id) return
  let [list, info] = (
    await Promise.allSettled([
      api('https://www.googleapis.com/youtube/v3/videos')
        .headers({ 'accept-language': 'en' })
        .query({
          key: ytApiKey,
          part: 'snippet,contentDetails',
          id: $id,
        })
        .get(),
      api('/scrape')
        .query({
          id: $id,
        })
        .get(),
    ])
  ).map(v => (v.status === 'fulfilled' ? v.value : null))
  // Set
  doClearMeta()
  meta.set([])
  ylist.set(list)
  ymeta.set(info)
}

// ---- Metadata

type Tuple = [string, string]
type Meta = Tuple[]

export const artist = writable('')
export const song = writable('')
export const notes = writable('')
export const plot = writable('')

const empty: Tuple = ['', '']
export const meta = writable<Meta>([])

ymeta.subscribe($ymeta => {
  if (!browser) return
  console.log('subscribe: ymeta')
  let tmp: Meta = []
  if ($ymeta) {
    for (let [key, val] of Object.entries($ymeta).reverse()) {
      if (key === 'artist') {
        artist.set(val)
        continue
      }
      if (key === 'song') {
        song.set(val)
        continue
      }
      tmp.unshift([key, val])
    }
  } else {
    // Try to guess artist and song from title
    let $ydata = get(ydata)
    if ($ydata) {
      let { title } = $ydata
      let tmp = title.split(/\s*[-:\/]\s*/, 2)
      console.log(tmp)
      if (tmp.length === 2) {
        artist.set(tmp[0])
        song.set(tmp[1])
      }
    }
  }
  meta.set(tmp)
})

meta.subscribe($meta => {
  if (!browser) return
  console.log('subscribe: meta')
  // Always add new field at the end
  if ($meta.length) {
    let [lk, lv] = $meta[$meta.length - 1]
    if (!lk && !lv) return
  }
  $meta.push(structuredClone(empty))
})

function doClearMeta() {
  artist.set('')
  song.set('')
  notes.set('')
  plot.set('')
}

// ---- Musicbrainz

type Bartist = {
  id: string
  name: string
  gender: string
  score: number
}

type BartistRes = {
  count: number
  artists: Bartist[]
}

type Brec = {
  score: number
  title: string
  tags?: { count: number; name: string }[]
}

type BrecRes = {
  count: number
  recordings: Brec[]
}

const imvdbApiKey = 'tXTzKvWu6l38kBCR6VYBb15wHeTY5oooKEyxDStv'

const apiBrainz = api('https://musicbrainz.org/ws/2/')
  .headers({
    'user-agent': 'Musiker 0.0 <martin@pokrok.org>',
  })
  .accept('application/json')

const apiImvdb = api('https://imvdb.com/api/v1/').headers({
  'imvdb-app-key': imvdbApiKey,
})
// .options({ cors: 'cors', redirect: 'follow' })

async function doGetBrainz() {
  let $artist = get(artist)
  let $song = get(song)
  let $meta = get(meta)
  if (!$artist && !$song) return false
  console.log('doGetBrainz', $artist, $song)
  let bares = null
  try {
    // Try to get artist
    bares = (await apiBrainz.url('artist').query({ query: $artist }).get()) as BartistRes
  } catch (err) {}
  if (bares && bares.count > 1) {
    let { id, name, score } = bares.artists[0]
    // TODO More smart matching
    // If artist match try to search for more info
    if (name === $artist) {
      let [bsores, imvdbres] = (
        await Promise.allSettled([
          // Get recording info
          apiBrainz
            .url('recording')
            .query({
              query: `${$song} AND arid:${id}`,
            })
            .get(),
          // Get music video info
          // TODO Resolve CORS error
          apiImvdb
            .url('search/videos')
            .query({ q: `${$artist} ${$song}` })
            .get(),
        ])
      ).map(v => (v.status === 'fulfilled' ? v.value : null))
      // Get genres
      let brecs = bsores.recordings.filter((v: Brec) => v.score > 90) as Brec[]
      if (brecs.length) {
        // We're only interested in results with most tags
        brecs.sort((a, b) => {
          let atc = a.tags?.length || 0
          let btc = b.tags?.length || 0
          if (atc > btc) return -1
          if (btc < atc) return 1
          return 0
        })
        console.log('brecs', brecs)
        let rec = brecs.shift()
        if (rec?.tags) {
          console.log(rec.tags)
          let gid = $meta.findIndex(([k, v]) => k === 'genres')
          $meta.splice(gid < 0 ? $meta.length - 1 : gid, gid < 0 ? 0 : 1, [
            'genres',
            rec.tags.map(v => v.name).join(', '),
          ])
          // console.log($meta)
          meta.set($meta)
        }
      }

      // TODO Imvdb
    }
  }
}

const doGetBrainzDebounced = _debounce(doGetBrainz, 100)

// On artist or song change
artist.subscribe($v => {
  if (!browser || !$v) return
  doGetBrainzDebounced()
})
song.subscribe($v => {
  if (!browser || !$v) return
  doGetBrainzDebounced()
})

// ---- Share

export async function doShare() {
  let data = {
    id: get(id),
    ...get(ydata),
    ymeta: get(ymeta),
    meta: {
      artist: get(artist),
      song: get(song),
      notes: get(notes),
      plot: get(plot),
      ...Object.fromEntries(get(meta)),
    },
    posted: Date(),
  }
  console.log(data)
  await api('/feed').post(data)
}
