import './index.css'
import WebMidi from 'webmidi'
import { entries } from '@tonaljs/chord-dictionary'
import { chord } from '@tonaljs/chord'
import { enharmonic } from '@tonaljs/note'
import Vex from 'vexflow'
import { sample } from 'lodash'

let VF = Vex.Flow

let div = document.getElementById('root')
let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG)

renderer.resize(500, 500)
let context = renderer.getContext()

let stave = new VF.Stave(10, 40, 400)
stave.addClef('treble').addTimeSignature('4/4')
stave.setContext(context).draw()

let tickContext = new VF.TickContext()

let css = entries()
  .map(chordType => chordType.name)
  .filter(chordType => chordType)

let chordData = css.map(c => {
  return chord('C ' + c)
})

let rawNotes = sample(chordData).notes
let noteParts = rawNotes.map(x => {
  // TODO: handle double sharp / flat
  let [letter, acc] = x.split('')

  return {
    letter,
    acc,
    octave: 4
  }
})

let notesWithOctave = rawNotes.map(x => x + 4)

let staveNotes = noteParts.map(n => {
  let note = new VF.StaveNote({
    clef: 'treble',
    keys: [n.letter + '/' + n.octave],
    duration: 'q'
  })
    .setContext(context)
    .setStave(stave)

  if (n.acc) {
    note.addAccidental(0, new VF.Accidental(n.acc))
  }

  tickContext.addTickable(note)

  return note
})

const group = context.openGroup()
VF.Formatter.FormatAndDraw(context, stave, staveNotes)
context.closeGroup()

let child = 0
let children = group.querySelectorAll('.vf-stavenote')

let colorNote = () => {
  children[child].classList.add('test')
  child++
}

WebMidi.enable(err => {
  if (err) {
    console.log('WebMidi could not be enabled.', err)
  } else {
    console.log('WebMidi enabled!')
    let [input] = WebMidi.inputs

    if (input) {
      input.addListener('noteon', 'all', e => {
        let note = e.note.name + e.note.octave
        if (
          [notesWithOctave[child], enharmonic(notesWithOctave[child])].includes(
            note
          )
        ) {
          colorNote()
        }
      })
    }
  }
})
