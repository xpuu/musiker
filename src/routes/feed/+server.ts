import { json } from '@sveltejs/kit'
import fs from 'fs'

let feed = JSON.parse(fs.readFileSync('./feed.json').toString())
console.log(feed)

export async function POST({ request }) {
  feed.unshift(await request.json())
  fs.writeFileSync('./feed.json', JSON.stringify(feed))
  return json({ status: 'ok' })
}

export function GET() {
  return json(feed)
}
