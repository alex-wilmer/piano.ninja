import './index.css'
import WebMidi from 'webmidi'
import { chord } from '@tonaljs/chord'
import Vex from 'vexflow'

// Basic setup boilerplate for using VexFlow with the SVG rendering context:
let VF = Vex.Flow;

let note

var vf = new Vex.Flow.Factory({
  renderer: { elementId: 'root', width: 500, height: 200 }
});

var score = vf.EasyScore();
var system = vf.System();

console.log(vf)


// let context = renderer.getContext();

// Create a stave of width 10000 at position 10, 40 on the canvas.
let stave = new VF.Stave(10, 10, 10000)
  .addClef('treble');

// Connect it to the rendering context and draw!
// stave.setContext(context).draw();

const group = vf.context.openGroup(); // create an SVG group element
group.classList.add('test')

system.addStave({
  voices: [score.voice(score.notes('C#5/q, B4, A4, G#4'))]
}).addClef('treble').addTimeSignature('4/4');

vf.draw();

vf.context.closeGroup(); // and close the group

// The tickContext.preFormat() call assigns x-values (and other
// formatting values) to notes. It must be called after we've 
// created the notes and added them to the tickContext. Or, it
// can be called each time a note is added, if the number of 
// notes needed is not known at the time of bootstrapping.
//
// To see what happens if you put it in the wrong place, try moving
// this line up to where the TickContext is initialized, and check
// out the error message you get.
//
// tickContext.setX() establishes the left-most x position for all
// of the 'tickables' (notes, etc...) in a context.
// tickContext.preFormat().setX(400);

// This will contain any notes that are currently visible on the staff,
// before they've either been answered correctly, or plumetted off
// the staff when a user fails to answer them correctly in time.
// TODO: Add sound effects.
const visibleNoteGroups = [];

// Add a note to the staff from the notes array (if there are any left).
// document.getElementById('add-note').addEventListener('click', (e) => {
//   note = notes.shift();
//   if (!note) return;
//   const group = context.openGroup();
//   visibleNoteGroups.push(group);
//   note.draw();
//   context.closeGroup();
//   group.classList.add('scroll');
//   // Force a dom-refresh by asking for the group's bounding box. Why? Most
//   // modern browsers are smart enough to realize that adding .scroll class
//   // hasn't changed anything about the rendering, so they wait to apply it
//   // at the next dom refresh, when they can apply any other changes at the
//   // same time for optimization. However, if we allow that to happen,
//   // then sometimes the note will immediately jump to its fully transformed
//   // position -- because the transform will be applied before the class with
//   // its transition rule. 
//   group.classList.add('scrolling');

//   // // If a user doesn't answer in time make the note fall below the staff
//   // window.setTimeout(() => {
//   //   const index = visibleNoteGroups.indexOf(group);
//   //   if (index === -1) return;
//   //   group.classList.add('too-slow');
//   //   visibleNoteGroups.shift();
//   // }, 5000);
// });

// If a user plays/identifies the note in time, send it up to note heaven.
// document.getElementById('right-answer').addEventListener('click', (e) => {
//   let group = visibleNoteGroups.shift();
//   group.classList.add('correct');
//   // The note will be somewhere in the middle of its move to the left -- by
//   // getting its computed style we find its x-position, freeze it there, and
//   // then send it straight up to note heaven with no horizontal motion.
//   const transformMatrix = window.getComputedStyle(group).transform;
//   // transformMatrix will be something like 'matrix(1, 0, 0, 1, -118, 0)'
//   // where, since we're only translating in x, the 4th property will be
//   // the current x-translation. You can dive into the gory details of
//   // CSS3 transform matrices (along with matrix multiplication) if you want
//   // at http://www.useragentman.com/blog/2011/01/07/css3-matrix-transform-for-the-mathematically-challenged/
//   const x = transformMatrix.split(',')[4].trim();
//   // And, finally, we set the note's style.transform property to send it skyward.
//   group.style.transform = `translate(${x}px, -800px)`;
// })


// WebMidi.enable(function (err) {

//   if (err) {
//     console.log("WebMidi could not be enabled.", err);
//   } else {
//     console.log("WebMidi enabled!");

//     console.log(WebMidi.inputs);

//     let [input] = WebMidi.inputs

//     console.log(input)

//     // var input = WebMidi.getInputByName("Axiom Pro 25 USB A In");
//     if (input) {
//       input.addListener('pitchbend', "all", function (e) {
//         console.log("Pitch value: " + e.value);
//       });

//       // Listen for a 'note on' message on all channels
//       input.addListener('noteon', "all",
//         function (e) {
//           console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
//         }
//       );
//     }
//   }

// });