const fs = require('fs').promises
const Note = require('@tonaljs/note')

// const base = '/Users/jakob/Google Drive/song-writer/generated/synthwave/'
const base = 'extracted-chords/'
// const file = 'chords-20200414_015109.txt'

function uniq(a) {
  return a.sort().filter(function (item, pos, ary) {
    return !pos || item != ary[pos - 1];
  })
}

async function getMLChords(file) {
  return fs.readFile(base + file, 'utf8')
    .then(data => {
      // clean all symbols out
      const cleaned = data.replace(/[^ \w]/g, ' ')
      // console.log('cleaned:', cleaned)
      let songs = cleaned.split('Chords')
      songs = songs.map(song => song.split(' ')
        .filter(note => Boolean(Note.get(note).name)).join(' ')
      )
      songs = uniq(songs)
      console.log('songs.length', songs.length)
      return songs
    })
    .catch(error => console.error(error))
}

module.exports = { getMLChords }
