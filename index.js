import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { Router, Link } from '@reach/router'
import { Flex } from 'rebass'
import { StoreProvider, createStore, useStoreState, action, useStoreActions } from 'easy-peasy'
import WebMidi from 'webmidi'
import L from './Lesson'

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

import './index.css'

let Header = () => (
  <Flex justifyContent="center">
    <span className="title">piano.ninja</span>
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

render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)
