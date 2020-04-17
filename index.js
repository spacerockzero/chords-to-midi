const { getMLChords } = require('./chords-from-ml-output')
const { makeMidiParts } = require('./midi')
const fs = require('fs').promises

const file = 'chords-20200414_015109.txt'

async function makeSongs(){
  const chords = await getMLChords(file)
  const dateTime = new Date().toISOString()
  const dir = 'generated/' + dateTime
  await fs.mkdir('generated/' + dateTime)
  // run sequentially to reduce race conditions with dirnames of dupes
  for await (song of chords){
    makeMidiParts(song, dir)
  }
  // const songProms = chords.map(song=>makeMidiParts(song, dir))
  // await Promise.all(songProms)
  console.log('Done writing all songs!')
}

makeSongs().then().catch(error=>console.error(error))
