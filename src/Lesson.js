import React, { useEffect, useState } from 'react'
import Tone from 'tone'
// import { entries } from '@tonaljs/chord-dictionary'
// import { chord } from '@tonaljs/chord'
// import { sample } from 'lodash'
import { enharmonic } from '@tonaljs/note'
import Vex from 'vexflow'
import { useStoreState } from 'easy-peasy'
import { scale } from '@tonaljs/scale'
import { splitNoteString } from './util/splitNoteString'
import { Flex } from 'rebass'

let cmaj = scale('c4 major').notes.map(splitNoteString)

export default () => {
  let [count, setCount] = useState(0)
  let webmidi = useStoreState(state => state.webmidi)

  useEffect(() => {
    let VF = Vex.Flow

    let div = document.getElementById('lessonRoot')
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG)

    renderer.resize(window.innerWidth, 200)
    let context = renderer.getContext()

    let barWidth = 400
    let bars = 2
    let xPos = (window.innerWidth / 2) - ((barWidth * 2) / 2)

    let stave = new VF.Stave(xPos, 0, barWidth)
    stave.addClef('treble')
    stave.addTimeSignature("4/4")
    stave.setEndBarType(Vex.Flow.Barline.type.SINGLE);
    stave.setContext(context).draw()

    let stave2 = new VF.Stave(xPos + barWidth, 0, barWidth)
    // stave2.setEndBarType(Vex.Flow.Barline.type.SINGLE);
    stave2.setContext(context).draw()

    let tickContext = new VF.TickContext()

    // let css = entries()
    //   .map(chordType => chordType.name)
    //   .filter(chordType => chordType)

    // let chordData = css.map(c => {
    //   return chord('C ' + c)
    // })

    // let rawNotes = [...sample(chordData).notes, ...sample(chordData).notes].slice(
    //   0,
    //   4
    // )

    // let noteParts = rawNotes.map(x => {
    //   // TODO: handle double sharp / flat
    //   let [letter, acc] = x.split('')

    //   return {
    //     letter,
    //     acc,
    //     octave: 4
    //   }
    // })

    // let notesWithOctave = rawNotes.map(x => x + 4)


    let staveNotes1 = cmaj.slice(0, 4).map(n => {
      let note = new VF.StaveNote({
        clef: 'treble',
        keys: [n.letter + '/' + n.octave],
        duration: 'q'
      })

      if (n.acc) {
        note.addAccidental(0, new VF.Accidental(n.acc))
      }

      tickContext.addTickable(note)

      return note
    })

    let staveNotes2 = cmaj.slice(4).map(n => {
      let note = new VF.StaveNote({
        clef: 'treble',
        keys: [n.letter + '/' + n.octave],
        duration: 'q'
      })

      if (n.acc) {
        note.addAccidental(0, new VF.Accidental(n.acc))
      }

      tickContext.addTickable(note)

      return note
    })

    let top = new VF.StaveNote({
      clef: 'treble',
      keys: ['c' + '/' + 5],
      duration: 'q'
    })
    tickContext.addTickable(top)
    staveNotes2.push(top)

    const group = context.openGroup()

    let bar = new VF.BarNote({ type: 'single' })
    tickContext.addTickable(bar)

    VF.Formatter.FormatAndDraw(context, stave, staveNotes1)
    VF.Formatter.FormatAndDraw(context, stave2, staveNotes2)

    context.closeGroup()

    let child = 0
    let children = group.querySelectorAll('.vf-stavenote')

    let colorNote = () => {
      children[child].classList.add('hit')
      child++
    }

    var synth = new Tone.PolySynth(6, Tone.Synth, {
      oscillator: {
        type: 'sine'
      }
    }).toMaster()

    // let countT = document.getElementById('count')
    let count = 4

    // let hitBtn = document.getElementById('hit')

    let times = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 2, 0],
      [0, 3, 0]
    ]

    let tickTimes = times.map(t => {
      return Tone.Time(t.join(':')).toTicks()
    })

    let click = 0

    // hitBtn.onclick = () => {
    //   if (!times[click]) return
    //   let tick = Tone.Transport.getTicksAtTime()
    //   let ttick = tickTimes[click]

    //   let delta = tick - ttick

    //   // TODO: accuracy ranges
    //   // late | early | good | perfect | missed

    //   // TODO: handle "missed"

    //   if (delta < 0) console.log('early')
    //   else if (delta > 0) console.log('late')
    //   else console.log('perfect')

    //   click++
    // }

    if (webmidi) {
      if (webmidi.input) {
        webmidi.input.addListener('noteon', 'all', e => {
          let note = e.note.name + e.note.octave
          synth.triggerAttack([note])

          if (
            [notesWithOctave[child], enharmonic(notesWithOctave[child])].includes(
              note
            )
          ) {
            colorNote()
          }
        })

        webmidi.input.addListener('noteoff', 'all', e => {
          let note = e.note.name + e.note.octave
          synth.triggerRelease([note])
        })
      }
    }

  }, [webmidi])

  let start = () => {
    Tone.Transport.start('+1')
    Tone.Transport.scheduleRepeat(time => {
      Tone.Draw.schedule(() => {
        setCount(s => s + 1)
      }, time)
    }, '4n')
  }

  return (
    <>
      <div id="lessonRoot" />
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <div style={{ visibility: count ? 'visible' : 'hidden' }}>{count}</div>
        <button onClick={start}>start</button>
      </Flex>
    </>
  )
}