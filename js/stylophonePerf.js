// Pythagorean Keyboard

// Create Web Audio Context
var context = new webkitAudioContext(),
  currentOscillator;

// Create keyboard using Qwerty Hancock
var keyboard = qwertyHancock(
  {
    id: 'perfectKeyboard',
    height: 200,
    width: 600,
    startNote: 'C1',
    octaves: 1,
    whiteKeyColour: '#eee',
    blackKeyColour: 'black',
    blackKeyWidth: 40,
    blackKeyHeight: 120,
    hoverColour: '#8ce700',
    keyboardLayout: 'en'
  }
);



var playNote = function (frequency) {
  var oscillator = context.createOscillator(),
  gainNode = context.createGainNode();

  // Disconnect existing oscillator if there is one.
  if (currentOscillator) {
    currentOscillator.disconnect();
  }

  oscillator.type = oscillator.SQUARE;
  oscillator.frequency.value = frequency;

  // Set volume of oscillator
// gainNode.gain.value = 0.3;

// Route oscillator through gain node to speakers
oscillator.connect(gainNode);
gainNode.connect(context.destination);

// For me!
console.log(frequency);

currentOscillator = oscillator;

oscillator.noteOn(0);
};

var stopNote = function () {
  currentOscillator.noteOff(0); // Stop after 0 seconds
  currentOscillator.disconnect();
};

// When you disconnect an oscillator, it gets picked up by the browser's garbage collector

keyboard.keyDown(function (note, frequency) {
  playNote(frequency);
});

keyboard.keyUp(function (note, frequency) {
  stopNote();
});



























