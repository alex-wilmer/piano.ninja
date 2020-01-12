import './index.css'
import WebMidi from 'webmidi'
// import { chord } from '@tonaljs/chord'
import Vex from 'vexflow'

let VF = Vex.Flow

let div = document.getElementById('root')
let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG)

renderer.resize(500, 500)
let context = renderer.getContext()

let stave = new VF.Stave(10, 40, 400)
stave.addClef('treble').addTimeSignature('4/4')
stave.setContext(context).draw()

var tickContext = new VF.TickContext()

let notes = [['c/4'], ['e/4'], ['g/4'], ['b/4']]

notes = notes.map(n => {
  let note = new VF.StaveNote({ clef: 'treble', keys: n, duration: 'q' })
    .setContext(context)
    .setStave(stave)

  tickContext.addTickable(note)

  return note
})

const group = context.openGroup() // create an SVG group element
VF.Formatter.FormatAndDraw(context, stave, notes)
context.closeGroup() // and close the group

let child = 0
let children = group.querySelectorAll('.vf-stavenote')

document.body.onclick = () => {
  children[child].classList.add('test')
  child++
}

WebMidi.enable(err => {
  if (err) {
    console.log('WebMidi could not be enabled.', err)
  } else {
    console.log('WebMidi enabled!')
    console.log(WebMidi.inputs)
    let [input] = WebMidi.inputs

    if (input) {
      input.addListener('pitchbend', 'all', e => {
        console.log('Pitch value: ' + e.value)
      })

      // Listen for a 'note on' message on all channels
      input.addListener('noteon', 'all', e => {
        console.log(
          "Received 'noteon' message (" + e.note.name + e.note.octave + ').'
        )
      })
    }
  }
})
