// ffmpeg -i sub.mkv -f srt -i sub.srt -map 0:0 -map 0:1 -map 1:0 -c:v copy -c:a copy -c:s mov_text output.mp4
// ffmpeg -i sub.mkv -f srt -i sub.srt -map 0:0 -map 0:1 -map 1:0 -c:v copy -c:a copy -c:s srt  output.mkv

import { writeFileSync } from 'fs'
import * as lineByLine from 'n-readlines'
import { IsTimecode, DeleteCueSettings } from './lib'

const [ input ] = process.argv.slice(2);

if (input == null) {
  console.error(`missin vtt file:
  command example >  $ vtt2srt sub.vtt 
  `)
  process.exit(1)
}

let [ name, ext ] = input.split('.')

if (ext != 'vtt') {
  console.error(`invalid file: please choose a vtt file`)
  process.exit(1)
}

let buff: Buffer
let count: number = 1
let block: string[] = []
let srtFile: string = ''

const rgxClean = /<[^>]*>/g
const liner = new lineByLine(input)
while (buff = liner.next()) {
  let line = buff.toString()
  
  if (IsTimecode(line)) {
    block = []
    block.push(count.toString())
    block.push(DeleteCueSettings(line))
  }
  
  if (line.includes('<') && block.length > 0) {
    block.push(line.replace(rgxClean, ''))
    srtFile += block.join('\n') + '\n\n'
    count++
  }
}

try {
  writeFileSync(`${name}.srt`, srtFile);
  console.log('done')
} catch(err) {
  // An error occurred
  console.error(err);
}