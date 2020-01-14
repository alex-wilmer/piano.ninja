import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { Router, Link } from '@reach/router'
import { Flex } from 'rebass'
import { StoreProvider, createStore, action, useStoreActions } from 'easy-peasy'
import WebMidi from 'webmidi'
import L from './Lesson'
import './index.css'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import Tone from 'tone'
import { midiToNoteName } from '@tonaljs/midi'

let synth = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    type: 'sine'
  }
}).toMaster()

let webmidiModel = {
  input: null,
  setInput: action((state, payload) => {
    state.input = payload;
  })
}

let storeModel = {
  webmidi: webmidiModel,
};

const store = createStore(storeModel)

let Header = () => (
  <Flex justifyContent="center">
    <Link to="/"><span className="title">piano.ninja</span></Link>
  </Flex>
)

let Home = () => (
  <>
    <Header />
    <Flex flexDirection="column">
      <Link to="lesson/c-major">Learn the C Major scale</Link>
    </Flex>
  </>
)

let Lesson = () => (
  <>
    <Header />
    <L />
  </>
)

let App = () => {
  const setInput = useStoreActions(actions => actions.webmidi.setInput);

  useEffect(() => {
    WebMidi.enable(err => {
      if (err) {
        console.log('WebMidi could not be enabled.', err)
      } else {
        console.log('WebMidi enabled!')
        let [input] = WebMidi.inputs

        if (input) setInput(input)

      }
    })
  }, [])

  return (
    <Router>
      <Home path="/" />
      <Lesson path="lesson/c-major" />
    </Router>
  )
}

const firstNote = MidiNumbers.fromNote('c3');
const lastNote = MidiNumbers.fromNote('f5');
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: firstNote,
  lastNote: lastNote,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

render(
  <StoreProvider store={store}>
    <>
      <App />
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber) => {
          // Play a given note - see notes below

          // synth.triggerAttack(['C#4'])
          synth.triggerAttack([midiToNoteName(midiNumber)])
          console.log('on', midiNumber)
        }}
        stopNote={(midiNumber) => {
          console.log('off', midiNumber)
          // Stop playing a given note - see notes below
          // synth.triggerRelease(['C#4'])
          synth.triggerRelease([midiToNoteName(midiNumber)])
          // synth.triggerRelease([midiNumber])
        }}
        width={window.innerWidth}
        keyboardShortcuts={keyboardShortcuts}
      />
    </>
  </StoreProvider>,
  document.getElementById('root')
)
