/*
 * Qwerty Hancock keyboard library v0.2
 * Copyright 2012-13, Stuart Memo
 * 
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 *
 * http://stuartmemo.com/qwerty-hancock
 */

(function( window, undefined ) {
    var qwertyHancock = function (settings) {

        var id = settings.id || 'keyboard',
            numberOfOctaves = 1,
            totalWhiteKeys = numberOfOctaves * 7,
            keyboardWidth = settings.width || 600,
            keyboardHeight = settings.height || 150,
            startNote = 'C1',
            startOctave = startNote.charAt(1),
            whiteKeyColour = settings.whiteKeyColour || '#FFF',
            blackKeyColour = settings.blackKeyColour || '#000',
            hoverColour = settings.hoverColour || '#076cf0',
            whiteKeyWidth = keyboardWidth / totalWhiteKeys,
            blackKeyWidth = settings.blackKeyWidth || whiteKeyWidth / 2,
            blackKeyHeight = settings.blackKeyHeight || keyboardHeight / 1.5,
            keyboardLayout = settings.keyboardLayout || "en",
            paper = new Raphael(id, keyboardWidth, keyboardHeight),
            notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], 
            notesWithSharps = ['C', 'D', 'F', 'G', 'A'], 
            noteCounter = 0,
            firstNote = startNote.charAt(0),
            octaveCounter = startOctave,
            qwertyOctave = startOctave,
            noteDown = false,
            keyDownCallback,
            keyUpCallback,
            keysDown = {},
            raphKeys = [],
            raphSharpKeys = [],
            newNotes = [];

        // Reset div height.
        document.getElementById(id).style.fontSize = '0px'; 

        var getFrequency = function (note) {
            var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#','A', 'A#', 'B'],
                octave;

            var frequencies = {
              C1: 128,
              C1s: 136.68,
              D1: 144,
              D1s: 153.77,
              E1: 162,
              F1: 176,
              F1s: 179.79,
              G1: 192,
              G1s: 205.03,
              A1: 216,
              A1s: 227.55,
              B1: 243,
              C2: 256,
              C2s: 266.66,
              D2: 288,
              D2s: 300,
              E2: 324,
              F2: 352,
              F2s: 364.5,
              G2: 384,
              G2s: 400,
              A2: 432,
              A2s: 444.4,
              B2: 486,
              C3: 512,
              C3s: 546.75,
              D3: 576,
              D3s: 615.09,
              E3: 648,
              F3: 704,
              F3s: 729,
              G3: 768,
              G3s: 820.125,
              A3: 864,
              A3s: 922.64,
              B3: 972
            };

            var keyNumber = notes.indexOf(note.slice(0, -1));

            switch(keyNumber)
              {
              case 0:
                return 128;
                break;
              case 1:
                return 136.68;
                break;
              case 2:
                return 144;
                break;
              case 3:
                return 153.77;
                break;
              case 4:
                return 162;
                break;
              case 5:
                return 176;
                break;
              case 6:
                return 179.79;
                break;
              case 7:
                return 192;
                break;
              case 8:
                return 205.03;
                break;
              case 9:
                return 216;
                break;
              case 10:
                return 227.55;
                break;
              case 11:
                return 243;
                break;
              case 12:
                return 256;
                break;
              case 13:
                return 266.66;
                break;
              case 14:
                return 288;
                break;
              case 15:
                return 300;
                break;
              case 16:
                return 324;
                break;
              case 17:
                return 352;
                break;
              case 18:
                return 364.5;
                break;
              default:
                return 384;
                break;
              }
        };

        for (var i = 0; i < 7; i++) {
            if (firstNote === notes[i]) {
                keyOffset = i;
                break;
            }
        }

        for (i = 0; i < 7; i++) {
            if (i + keyOffset > 6) {
                newNotes[i] = notes[i + keyOffset -7];
            } else {
                newNotes[i] = notes[i + keyOffset];
            }
        }

        for (i = 0; i < totalWhiteKeys; i++) {
            if ((i % notes.length) === 0) {
                noteCounter = 0;
            }

            var bizarreNoteCounter = (newNotes[noteCounter]);

            if (bizarreNoteCounter === 'C') {
                octaveCounter++;
            }

            raphKeys[i] = paper.rect(whiteKeyWidth * i, 0, whiteKeyWidth, keyboardHeight).attr(
                {
                    id: newNotes[noteCounter],
                    title: newNotes[noteCounter] + (octaveCounter - 1),
                    fill: whiteKeyColour
                } ).mousedown(function () {
                    noteDown = true;
                    this.attr({fill: hoverColour});
                    keyDownCallback(this.attr('title'), getFrequency(this.attrs.title));
                }).mouseover(function () {
                    if (noteDown) {
                        this.attr({fill: hoverColour});
                        keyDownCallback(this.attr('title'), getFrequency(this.attrs.title));
                    }
                }).mouseup(function () {
                    this.attr({fill: whiteKeyColour});
                    noteDown = false;
                    keyUpCallback(this.attr('title'), getFrequency(this.attrs.title));
                }).mouseout(function () {
                    if (noteDown) {
                      this.attr({fill: whiteKeyColour});
                      keyUpCallback(this.attr('title'), getFrequency(this.attrs.title));
                    }
                });

            noteCounter++;
        }

        octaveCounter = startOctave;

        for (i = 0; i < totalWhiteKeys; i++) {
            if ((i % notes.length) === 0) {
                noteCounter = 0;
            }
            for (var j = 0; j < notesWithSharps.length; j++) {
                if (newNotes[noteCounter] === notesWithSharps[j]) { 
                    bizarreNoteCounter = (newNotes[noteCounter] + '#');
                    if (bizarreNoteCounter === 'C#') {
                        octaveCounter++;
                    }
                    // Don't draw last black note
                    if ((whiteKeyWidth * (i + 1)) < keyboardWidth) {
                        raphSharpKeys[i] = paper.rect((whiteKeyWidth * (i + 1)) - (blackKeyWidth / 2), 0, blackKeyWidth,
                                            blackKeyHeight).attr(
                                                {
                                                    id: newNotes[noteCounter],
                                                    title: newNotes[noteCounter] + '#' + (octaveCounter - 1),
                                                    fill: blackKeyColour
                                                }
                        ).mousedown(function () {
                            noteDown = true;
                            this.attr({fill: hoverColour});
                            keyDownCallback(this.attr('title'), getFrequency(this.attrs.title));
                        }).mouseover(function () {
                            if (noteDown) {
                                this.attr({fill: hoverColour});
                                keyDownCallback(this.attr('title'), getFrequency(this.attrs.title));
                            }
                        }).mouseup(function () {
                          this.attr({fill: blackKeyColour});
                           noteDown = false;
                           keyUpCallback(this.attr('title'), getFrequency(this.attrs.title));
                        }).mouseout(function () {
                            if (noteDown) {
                              this.attr({fill: blackKeyColour});
                              keyUpCallback(this.attr('title'), getFrequency(this.attrs.title));
                            }
                        });
                    }
                }
            }
            noteCounter++;
        }

        if (keyboardLayout == "en") {
            var keyToKey = {
                65: 'Cl',
                87: 'C#l',
                83: 'Dl',
                69: 'D#l',
                68: 'El',
                70: 'Fl',
                84: 'F#l',
                71: 'Gl',
                89: 'G#l',
                72: 'Al',
                85: 'A#l',
                74: 'Bl',
                75: 'Cu',
                79: 'C#u',
                76: 'Du',
                80: 'D#u',
                186: 'Eu',
                222: 'Fu',
                221: 'F#u',
                220: 'Gu'

            };
        } else if (keyboardLayout == "de") {
            var keyToKey = {
                65: 'Cl',
                87: 'C#l',
                83: 'Dl',
                69: 'D#l',
                68: 'El',
                70: 'Fl',
                84: 'F#l',
                71: 'Gl',
                90: 'G#l',
                72: 'Al',
                85: 'A#l',
                74: 'Bl',
                75: 'Cu',
                79: 'C#u',
                76: 'Du',
                80: 'D#u',
                186: 'Eu',
                222: 'Fu',
                221: 'F#u',
                220: 'Gu'
            };
        }

        var keyboardDown = function (key) {
           if (key.keyCode in keysDown) {
               return;
           }

           keysDown[key.keyCode] = true;

           for (var i = 0; i < raphKeys.length; i++) {
               if ((typeof keyToKey[key.keyCode] !== 'undefined') && (typeof raphKeys[i] !== 'undefined')) {
                   var keyPressed = keyToKey[key.keyCode].replace('l', qwertyOctave).replace('u', (parseInt(qwertyOctave, 10) + 1).toString());
                   if (raphKeys[i].attrs.title === keyPressed) {
                       raphKeys[i].attr({fill: hoverColour});
                       keyDownCallback(raphKeys[i].attrs.title, getFrequency(raphKeys[i].attrs.title));
                   }
               }
           }

           for (i = 0; i < raphSharpKeys.length; i++) {
               if ((typeof keyToKey[key.keyCode] !== 'undefined') && (typeof raphSharpKeys[i] !== 'undefined')) {
                   keyPressed = keyToKey[key.keyCode].replace('l', qwertyOctave).replace('u', (parseInt(qwertyOctave, 10) + 1).toString());
                   if (raphSharpKeys[i].attrs.title === keyPressed) {
                       raphSharpKeys[i].attr({fill: hoverColour});
                       keyDownCallback(keyPressed, getFrequency(keyPressed));
                   }
               }
           }
       };

       var keyboardUp = function (key) {
            delete keysDown[key.keyCode];
            for (var i = 0; i < raphKeys.length; i++) {
               if ((typeof keyToKey[key.keyCode] !== 'undefined') && (typeof raphKeys[i] !== 'undefined')) {
                   var keyPressed = keyToKey[key.keyCode].replace('l', qwertyOctave).replace('u', (parseInt(qwertyOctave, 10) + 1).toString());
                   if (raphKeys[i].attrs.title === keyPressed) {
                       raphKeys[i].attr({fill: whiteKeyColour});
                       keyUpCallback(raphKeys[i].attrs.title, getFrequency(raphKeys[i].attrs.title));
                   }
               }
            }

            for (i = 0; i < raphSharpKeys.length; i++) {
               if ((typeof keyToKey[key.keyCode] !== 'undefined') && (typeof raphSharpKeys[i] !== 'undefined')) {
                   keyPressed = keyToKey[key.keyCode].replace('l', qwertyOctave).replace('u', (parseInt(qwertyOctave, 10) + 1).toString());
                   if (raphSharpKeys[i].attrs.title === keyPressed) {
                       raphSharpKeys[i].attr({fill: blackKeyColour});
                       keyUpCallback(keyPressed, getFrequency(keyPressed));
                   }
               }
            }
        };

       window.onkeydown = keyboardDown;
       window.onkeyup = keyboardUp;

       var setKeyDownCallback = function (userCallback) {
           keyDownCallback = userCallback;
       };
     
       var setKeyUpCallback = function (userCallback) {
           keyUpCallback = userCallback;
       };

       return {
            keyDown: setKeyDownCallback,
            keyUp: setKeyUpCallback
       };
    };

    window.qwertyHancock = qwertyHancock;

})(window);
