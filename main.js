/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dist_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../dist/index.js */ \"../dist/index.js\");\n\n\nconst client = new _dist_index_js__WEBPACK_IMPORTED_MODULE_0__.Client()\n\nwindow.addEventListener('load', () => {\n    client.start();\n\n    // layers that are being played currently\n    let layers = [];\n\n    console.log('Registering key press handlers 22');\n    document.addEventListener('keydown', event => {\n        if (event.key in layers) {\n            return;\n        }\n\n        if ('12345678'.indexOf(event.key) >= 0) {\n            layers[event.key] = client.play(parseInt(event.key, 10));\n        }\n    });\n\n    document.addEventListener('keyup', event => {\n        if (event.key in layers) {\n            layers[event.key].stop();\n            delete layers[event.key]; // TODO: clear `layers`\n        }\n    });\n})\n\n\n//# sourceURL=webpack://marper-demo/./src/index.js?");

/***/ }),

/***/ "../dist/client.js":
/*!*************************!*\
  !*** ../dist/client.js ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Client = void 0;\nvar clock_1 = __webpack_require__(/*! ./clock */ \"../dist/clock.js\");\nvar midi_1 = __webpack_require__(/*! ./midi */ \"../dist/midi.js\");\nvar sequencer_1 = __webpack_require__(/*! ./sequencer */ \"../dist/sequencer.js\");\nvar Client = /** @class */ (function () {\n    function Client() {\n        this.clock = new clock_1.Clock(this);\n        this.midi = new midi_1.MIDI();\n        this.sequencer = new sequencer_1.Sequencer(this.midi);\n    }\n    Client.prototype.start = function () {\n        this.clock.start();\n        this.midi.start();\n    };\n    Client.prototype.click = function () {\n        this.sequencer.click();\n    };\n    Client.prototype.play = function (degree) {\n        return this.sequencer.play(degree);\n    };\n    return Client;\n}());\nexports.Client = Client;\n\n\n//# sourceURL=webpack://marper-demo/../dist/client.js?");

/***/ }),

/***/ "../dist/clock.js":
/*!************************!*\
  !*** ../dist/clock.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Clock = void 0;\nvar Clock = /** @class */ (function () {\n    function Clock(client) {\n        this.client = client;\n    }\n    Clock.prototype.start = function () {\n        var _this = this;\n        // create a URL for the worker script\n        var script = 'onmessage = (e) => { setInterval(() => { postMessage(true) }, e.data) }';\n        var url = window.URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));\n        // currently hard coded\n        var bpm = 60;\n        // we use a web worker as it is more accurate for keeping time\n        // this is true espacially when tab is not in focus\n        // reference: https://hackwild.com/article/web-worker-timers\n        this.worker = new Worker(url);\n        this.worker.postMessage(((60 * 1000) / bpm) / Clock.Subdivisions);\n        this.worker.onmessage = function (event) {\n            _this.client.click();\n        };\n    };\n    // bars are in 1/4 time signature.\n    // the following note values are supported:\n    //   1) 1/16 (4 notes in a bar)\n    //   2) 1/8 (2 notes in a bar)\n    //   3) 1/8 triplet (3 notes in a bar)\n    // therefore, we use a multiply of 12 for the number of subdivisions in a bar,\n    // as it gives us the needed rhythmic precision.\n    // the larger the value we use, the shorter the gap between subdivisions,\n    // making it more interactive, but more performance consuming.\n    Clock.Subdivisions = 96;\n    return Clock;\n}());\nexports.Clock = Clock;\n\n\n//# sourceURL=webpack://marper-demo/../dist/clock.js?");

/***/ }),

/***/ "../dist/index.js":
/*!************************!*\
  !*** ../dist/index.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Client = void 0;\nvar client_1 = __webpack_require__(/*! ./client */ \"../dist/client.js\");\nObject.defineProperty(exports, \"Client\", ({ enumerable: true, get: function () { return client_1.Client; } }));\n\n\n//# sourceURL=webpack://marper-demo/../dist/index.js?");

/***/ }),

/***/ "../dist/layer.js":
/*!************************!*\
  !*** ../dist/layer.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Layer = void 0;\nvar clock_1 = __webpack_require__(/*! ./clock */ \"../dist/clock.js\");\nvar State;\n(function (State) {\n    State[State[\"Active\"] = 0] = \"Active\";\n    State[State[\"Stopped\"] = 1] = \"Stopped\";\n    State[State[\"Inactive\"] = 2] = \"Inactive\";\n})(State || (State = {}));\nvar Layer = /** @class */ (function () {\n    function Layer(midi, degree) {\n        this.state = State.Active;\n        this.subdivisions = 0;\n        this.played = undefined;\n        this.midi = midi;\n        this.degree = degree;\n        console.log('[Layer]', \"Starting layer of degree \" + this.degree);\n    }\n    Layer.prototype.off = function () {\n        if (this.played) {\n            this.midi.off(this.played);\n            this.played = undefined;\n        }\n    };\n    Layer.prototype.on = function (note) {\n        // stop the currently playing note if there's one\n        this.off();\n        // play this new note\n        this.played = note;\n        this.midi.on(this.played);\n    };\n    Layer.prototype.click = function () {\n        if (this.state === State.Active) {\n            var configuration = {\n                root: 60,\n                mode: 'ionian',\n                steps: 4,\n            };\n            var number = undefined; // the midi note number to be played\n            for (var index = 0; index < configuration.steps; ++index) {\n                if (this.subdivisions == (clock_1.Clock.Subdivisions / configuration.steps) * index) {\n                    // we use the major scale for now\n                    var scale = [0 /* P1 */, 2 /* M2 */, 4 /* M3 */, 5 /* P4 */, 7 /* P5 */, 9 /* M6 */, 11 /* M7 */];\n                    // all modern modes of the major scale\n                    var modes = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];\n                    // get the offset of the mode in the scale\n                    var offset = modes.indexOf(configuration.mode.toLowerCase());\n                    if (offset === -1) {\n                        console.warn('[Layer]', \"Unrecognized mode '\" + configuration.mode + \"'\");\n                        continue;\n                    }\n                    // we build chords by stacking thirds starting from the scale degree.\n                    // this can be done by skipping every other note of the diatonic scale.\n                    // we calculate the scale degree of the current chord degree.\n                    // use the mode offset as well to get the correct interval.\n                    var degree = offset + (this.degree - 1) + (index * 2);\n                    // the degree can be greater than 7 and we need to take\n                    // the interval some octaves higher in such cases.\n                    // we also normalize the interval according to the mode.\n                    var interval = scale[degree % scale.length] + (Math.floor(degree / scale.length) * 12 /* P8 */) - scale[offset];\n                    // calculate the final midi note number\n                    number = configuration.root + interval;\n                }\n            }\n            if (number) {\n                this.on({ channel: 0, number: number, velocity: 127 });\n            }\n            // advance to the next subdivision\n            this.subdivisions = (this.subdivisions + 1) % clock_1.Clock.Subdivisions;\n        }\n        else if (this.state === State.Stopped) {\n            this.off();\n            this.state = State.Inactive;\n        }\n        else {\n            console.warn('[Layer]', \"Unexpected state \" + this.state);\n        }\n    };\n    Layer.prototype.stop = function () {\n        console.log('[Layer]', \"Stopping layer of degree \" + this.degree);\n        this.state = State.Stopped;\n    };\n    Layer.prototype.active = function () {\n        return this.state !== State.Inactive;\n    };\n    return Layer;\n}());\nexports.Layer = Layer;\n\n\n//# sourceURL=webpack://marper-demo/../dist/layer.js?");

/***/ }),

/***/ "../dist/midi.js":
/*!***********************!*\
  !*** ../dist/midi.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MIDI = void 0;\nvar MIDI = /** @class */ (function () {\n    function MIDI() {\n        this.outputs = []; // all available MIDI outputs\n    }\n    MIDI.prototype.start = function () {\n        var _this = this;\n        console.debug('[MIDI]', 'Starting');\n        navigator.requestMIDIAccess().then(function (midiAccess) { _this.access(midiAccess); }, function (err) { console.error('[MIDI]', 'No MIDI available', err); });\n    };\n    MIDI.prototype.access = function (midiAccess) {\n        var _this = this;\n        console.debug('[MIDI]', 'Accessing MIDI devices');\n        midiAccess.outputs.forEach(function (output) {\n            _this.outputs.push(output);\n        });\n        if (this.outputs.length > 0) {\n            this.output = this.outputs[0];\n            console.log('[MIDI]', \"Selected output device \" + this.output.name);\n        }\n        else {\n            console.error('[MIDI]', 'Could not find MIDI output devices');\n        }\n    };\n    MIDI.prototype.on = function (note) {\n        var _a;\n        (_a = this.output) === null || _a === void 0 ? void 0 : _a.send([0x90 + note.channel, note.number, note.velocity]);\n    };\n    MIDI.prototype.off = function (note) {\n        var _a;\n        (_a = this.output) === null || _a === void 0 ? void 0 : _a.send([0x80 + note.channel, note.number, 0]);\n    };\n    return MIDI;\n}());\nexports.MIDI = MIDI;\n\n\n//# sourceURL=webpack://marper-demo/../dist/midi.js?");

/***/ }),

/***/ "../dist/sequencer.js":
/*!****************************!*\
  !*** ../dist/sequencer.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Sequencer = void 0;\nvar layer_1 = __webpack_require__(/*! ./layer */ \"../dist/layer.js\");\nvar Sequencer = /** @class */ (function () {\n    function Sequencer(midi) {\n        this.layers = [];\n        this.midi = midi;\n    }\n    Sequencer.prototype.play = function (degree) {\n        // create the new layer\n        var layer = new layer_1.Layer(this.midi, degree);\n        // store it to be clicked\n        this.layers.push(layer);\n        // return it to the user for stopping\n        return layer;\n    };\n    Sequencer.prototype.click = function () {\n        // clear previously revoked layers\n        this.layers = this.layers.filter(function (layer) { return layer.active(); });\n        // click all layers\n        this.layers.forEach(function (layer) { return layer.click(); });\n    };\n    return Sequencer;\n}());\nexports.Sequencer = Sequencer;\n\n\n//# sourceURL=webpack://marper-demo/../dist/sequencer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;