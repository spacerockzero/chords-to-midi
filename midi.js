// scribbletune docs main demo
const scribble = require('scribbletune');
// const clips = ['1032', '2032', '4021', '3052'].map(order =>
//   scribble.clip({
//     pattern: '[xx][xR]'.repeat(4),
//     notes: scribble.arp({
//       chords: 'Dm BbM Am FM BbM FM CM Gm',
//       count: 8,
//       order,
//     }),
//     accent: 'x-xx--xx',
//   })
// );
// scribble.midi([].concat(...clips), 'chords.mid');

// const theNotes = 'E Abm Ab Gb Db B Bb Ebm'

const { chord, clip, midi, arp } = require('scribbletune');
const fs = require('fs').promises
const { Chord } = require("@tonaljs/tonal");

const arpOrders8 = ['01230123','01234567','76543210','01215434','12341234','43214321']
const arpOrders4 = ['0123','4567','7654','5434','1234','4321', '0121','1324','4231']

async function makeMidiParts(myNotes, dir){
  console.log('Starting song:', myNotes)
  if (myNotes.length <= 1){
    return
  }
  const songDirName = myNotes.trim()
  const saveDir = `./${dir}/${songDirName}`
  await fs.mkdir(saveDir)
  const notesArr = myNotes.split(' ')

  // pad
  const padClip = clip({
    notes: myNotes,
    pattern: 'x___'.repeat(notesArr.length)
  });

  // arpeggio
  // const randArp = arpOrders[Math.floor(Math.random() * arpOrders.length)]
  function getRandArp(){
    return arpOrders4[Math.floor(Math.random() * arpOrders4.length)]
  }
  const arpArr = arp({
    chords: myNotes,
    count: 8,
    // order: '01215434'
    order: getRandArp()+getRandArp()
  })
  const arpClips = clip({
    notes: arpArr,
    pattern: 'xxxx'.repeat(notesArr.length*2),
    subdiv: '8n'
  });
  // const arpClips = ['10321032', '20322032', '40214021', '30523052'].map(order =>
  //     scribble.clip({
  //       pattern: '[xx][xR]'.repeat(4),
  //       notes: scribble.arp({
  //         // chords: 'Dm BbM Am FM BbM FM CM Gm',
  //         chords: myNotes,
  //         count: 8,
  //         order,
  //       }),
  //       accent: 'x-xx--xx',
  //     })
  //   );

  // synth-bass
  const rep = 6
  const roots = notesArr.map(chord => Chord.get(chord)['tonic'])
  const rootOctaves = roots.map(root=>(root+'3 ').repeat(rep)).join('')
  // console.log('rootOctaves:', rootOctaves)

  const bassClip = clip({
    notes: rootOctaves,
    pattern: '-xxx'.repeat(roots.length*2),
    subdiv: '8n'
  });
  // console.log('bassClip:', bassClip)
  midi(padClip, `${saveDir}/pad.mid`);
  midi([].concat(...arpClips), `${saveDir}/arp.mid`);
  midi(bassClip, `${saveDir}/bass.mid`);
  console.log('Done writing:', myNotes)
  return
}

// makeMidiParts(theNotes).then()

module.exports = { makeMidiParts }
