import { writable } from 'svelte/store'
import { api } from '~/lib/api'

type Item = {
  id: string
  title: string
  description: string
  tags: string[]
  duration: string
  ymeta: {
    artist: string
    song: string
    [key: string]: string
  }
  meta: {
    artist: string
    song: string
    notes: string
    plot: string
    [key: string]: string
  }
  posted: Date
}

export const feed = writable<Item[]>([])

export async function doGetFeed() {
  feed.set(await api('/feed').get())
}
