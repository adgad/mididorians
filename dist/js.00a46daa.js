// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@tonaljs/core/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coordToInterval = coordToInterval;
exports.coordToNote = coordToNote;
exports.decode = decode;
exports.deprecate = deprecate;
exports.distance = distance;
exports.encode = encode;
exports.interval = interval;
exports.isNamed = isNamed;
exports.isPitch = isPitch;
exports.note = note;
exports.tokenizeInterval = tokenizeInterval;
exports.tokenizeNote = tokenizeNote;
exports.transpose = transpose;
exports.stepToLetter = exports.fillStr = exports.altToAcc = exports.accToAlt = void 0;

/**
 * Fill a string with a repeated character
 *
 * @param character
 * @param repetition
 */
const fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);

exports.fillStr = fillStr;

function deprecate(original, alternative, fn) {
  return function (...args) {
    // tslint:disable-next-line
    console.warn(`${original} is deprecated. Use ${alternative}.`);
    return fn.apply(this, args);
  };
}

function isNamed(src) {
  return src !== null && typeof src === "object" && typeof src.name === "string" ? true : false;
}

function isPitch(pitch) {
  return pitch !== null && typeof pitch === "object" && typeof pitch.step === "number" && typeof pitch.alt === "number" ? true : false;
} // The number of fifths of [C, D, E, F, G, A, B]


const FIFTHS = [0, 2, 4, -1, 1, 3, 5]; // The number of octaves it span each step

const STEPS_TO_OCTS = FIFTHS.map(fifths => Math.floor(fifths * 7 / 12));

function encode(pitch) {
  const {
    step,
    alt,
    oct,
    dir = 1
  } = pitch;
  const f = FIFTHS[step] + 7 * alt;

  if (oct === undefined) {
    return [dir * f];
  }

  const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
  return [dir * f, dir * o];
} // We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ["F", "C", "G", "D", "A", "E", "B"] we have:


const FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];

function decode(coord) {
  const [f, o, dir] = coord;
  const step = FIFTHS_TO_STEPS[unaltered(f)];
  const alt = Math.floor((f + 1) / 7);

  if (o === undefined) {
    return {
      step,
      alt,
      dir
    };
  }

  const oct = o + 4 * alt + STEPS_TO_OCTS[step];
  return {
    step,
    alt,
    oct,
    dir
  };
} // Return the number of fifths as if it were unaltered


function unaltered(f) {
  const i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}

const NoNote = {
  empty: true,
  name: "",
  pc: "",
  acc: ""
};
const cache = new Map();

const stepToLetter = step => "CDEFGAB".charAt(step);

exports.stepToLetter = stepToLetter;

const altToAcc = alt => alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);

exports.altToAcc = altToAcc;

const accToAlt = acc => acc[0] === "b" ? -acc.length : acc.length;
/**
 * Given a note literal (a note name or a note object), returns the Note object
 * @example
 * note('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */


exports.accToAlt = accToAlt;

function note(src) {
  const cached = cache.get(src);

  if (cached) {
    return cached;
  }

  const value = typeof src === "string" ? parse(src) : isPitch(src) ? note(pitchName(src)) : isNamed(src) ? note(src.name) : NoNote;
  cache.set(src, value);
  return value;
}

const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
/**
 * @private
 */

function tokenizeNote(str) {
  const m = REGEX.exec(str);
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}
/**
 * @private
 */


function coordToNote(noteCoord) {
  return note(decode(noteCoord));
}

const mod = (n, m) => (n % m + m) % m;

const SEMI = [0, 2, 4, 5, 7, 9, 11];

function parse(noteName) {
  const tokens = tokenizeNote(noteName);

  if (tokens[0] === "" || tokens[3] !== "") {
    return NoNote;
  }

  const letter = tokens[0];
  const acc = tokens[1];
  const octStr = tokens[2];
  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = accToAlt(acc);
  const oct = octStr.length ? +octStr : undefined;
  const coord = encode({
    step,
    alt,
    oct
  });
  const name = letter + acc + octStr;
  const pc = letter + acc;
  const chroma = (SEMI[step] + alt + 120) % 12;
  const height = oct === undefined ? mod(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
  const midi = height >= 0 && height <= 127 ? height : null;
  const freq = oct === undefined ? null : Math.pow(2, (height - 69) / 12) * 440;
  return {
    empty: false,
    acc,
    alt,
    chroma,
    coord,
    freq,
    height,
    letter,
    midi,
    name,
    oct,
    pc,
    step
  };
}

function pitchName(props) {
  const {
    step,
    alt,
    oct
  } = props;
  const letter = stepToLetter(step);

  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}

const NoInterval = {
  empty: true,
  name: "",
  acc: ""
}; // shorthand tonal notation (with quality after number)

const INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})"; // standard shorthand notation (with quality before number)

const INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
const REGEX$1 = new RegExp("^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$");
/**
 * @private
 */

function tokenizeInterval(str) {
  const m = REGEX$1.exec(`${str}`);

  if (m === null) {
    return ["", ""];
  }

  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
}

const cache$1 = {};
/**
 * Get interval properties. It returns an object with:
 *
 * - name: the interval name
 * - num: the interval number
 * - type: 'perfectable' or 'majorable'
 * - q: the interval quality (d, m, M, A)
 * - dir: interval direction (1 ascending, -1 descending)
 * - simple: the simplified number
 * - semitones: the size in semitones
 * - chroma: the interval chroma
 *
 * @param {string} interval - the interval name
 * @return {Object} the interval properties
 *
 * @example
 * import { interval } from '@tonaljs/core'
 * interval('P5').semitones // => 7
 * interval('m3').type // => 'majorable'
 */

function interval(src) {
  return typeof src === "string" ? cache$1[src] || (cache$1[src] = parse$1(src)) : isPitch(src) ? interval(pitchName$1(src)) : isNamed(src) ? interval(src.name) : NoInterval;
}

const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";

function parse$1(str) {
  const tokens = tokenizeInterval(str);

  if (tokens[0] === "") {
    return NoInterval;
  }

  const num = +tokens[0];
  const q = tokens[1];
  const step = (Math.abs(num) - 1) % 7;
  const t = TYPES[step];

  if (t === "M" && q === "P") {
    return NoInterval;
  }

  const type = t === "M" ? "majorable" : "perfectable";
  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  const simple = num === 8 || num === -8 ? num : dir * (step + 1);
  const alt = qToAlt(type, q);
  const oct = Math.floor((Math.abs(num) - 1) / 7);
  const semitones = dir * (SIZES[step] + alt + 12 * oct);
  const chroma = (dir * (SIZES[step] + alt) % 12 + 12) % 12;
  const coord = encode({
    step,
    alt,
    oct,
    dir
  });
  return {
    empty: false,
    name,
    num,
    q,
    step,
    alt,
    dir,
    type,
    simple,
    semitones,
    chroma,
    coord,
    oct
  };
}
/**
 * @private
 */


function coordToInterval(coord) {
  const [f, o = 0] = coord;
  const isDescending = f * 7 + o * 12 < 0;
  const ivl = isDescending ? [-f, -o, -1] : [f, o, 1];
  return interval(decode(ivl));
}

function qToAlt(type, q) {
  return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
} // return the interval name of a pitch


function pitchName$1(props) {
  const {
    step,
    alt,
    oct = 0,
    dir
  } = props;

  if (!dir) {
    return "";
  }

  const num = step + 1 + 7 * oct;
  const d = dir < 0 ? "-" : "";
  const type = TYPES[step] === "M" ? "majorable" : "perfectable";
  const name = d + num + altToQ(type, alt);
  return name;
}

function altToQ(type, alt) {
  if (alt === 0) {
    return type === "majorable" ? "M" : "P";
  } else if (alt === -1 && type === "majorable") {
    return "m";
  } else if (alt > 0) {
    return fillStr("A", alt);
  } else {
    return fillStr("d", type === "perfectable" ? alt : alt + 1);
  }
}
/**
 * Transpose a note by an interval.
 *
 * @param {string} note - the note or note name
 * @param {string} interval - the interval or interval name
 * @return {string} the transposed note name or empty string if not valid notes
 * @example
 * import { tranpose } from "@tonaljs/core"
 * transpose("d3", "3M") // => "F#3"
 * transpose("D", "3M") // => "F#"
 * ["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3)) // => ["E", "F#", "G#", "A", "B"]
 */


function transpose(noteName, intervalName) {
  const note$1 = note(noteName);
  const interval$1 = interval(intervalName);

  if (note$1.empty || interval$1.empty) {
    return "";
  }

  const noteCoord = note$1.coord;
  const intervalCoord = interval$1.coord;
  const tr = noteCoord.length === 1 ? [noteCoord[0] + intervalCoord[0]] : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
  return coordToNote(tr).name;
}
/**
 * Find the interval distance between two notes or coord classes.
 *
 * To find distance between coord classes, both notes must be coord classes and
 * the interval is always ascending
 *
 * @param {Note|string} from - the note or note name to calculate distance from
 * @param {Note|string} to - the note or note name to calculate distance to
 * @return {string} the interval name or empty string if not valid notes
 *
 */


function distance(fromNote, toNote) {
  const from = note(fromNote);
  const to = note(toNote);

  if (from.empty || to.empty) {
    return "";
  }

  const fcoord = from.coord;
  const tcoord = to.coord;
  const fifths = tcoord[0] - fcoord[0];
  const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12);
  return coordToInterval([fifths, octs]).name;
}
},{}],"node_modules/@tonaljs/abc-notation/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abcToScientificNotation = abcToScientificNotation;
exports.distance = distance;
exports.scientificToAbcNotation = scientificToAbcNotation;
exports.tokenize = tokenize;
exports.transpose = transpose;
exports.default = void 0;

var _core = require("@tonaljs/core");

const fillStr = (character, times) => Array(times + 1).join(character);

const REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;

function tokenize(str) {
  const m = REGEX.exec(str);

  if (!m) {
    return ["", "", ""];
  }

  return [m[1], m[2], m[3]];
}
/**
 * Convert a (string) note in ABC notation into a (string) note in scientific notation
 *
 * @example
 * abcToScientificNotation("c") // => "C5"
 */


function abcToScientificNotation(str) {
  const [acc, letter, oct] = tokenize(str);

  if (letter === "") {
    return "";
  }

  let o = 4;

  for (let i = 0; i < oct.length; i++) {
    o += oct.charAt(i) === "," ? -1 : 1;
  }

  const a = acc[0] === "_" ? acc.replace(/_/g, "b") : acc[0] === "^" ? acc.replace(/\^/g, "#") : "";
  return letter.charCodeAt(0) > 96 ? letter.toUpperCase() + a + (o + 1) : letter + a + o;
}
/**
 * Convert a (string) note in scientific notation into a (string) note in ABC notation
 *
 * @example
 * scientificToAbcNotation("C#4") // => "^C"
 */


function scientificToAbcNotation(str) {
  const n = (0, _core.note)(str);

  if (n.empty || !n.oct) {
    return "";
  }

  const {
    letter,
    acc,
    oct
  } = n;
  const a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
  const l = oct > 4 ? letter.toLowerCase() : letter;
  const o = oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
  return a + l + o;
}

function transpose(note, interval) {
  return scientificToAbcNotation((0, _core.transpose)(abcToScientificNotation(note), interval));
}

function distance(from, to) {
  return (0, _core.distance)(abcToScientificNotation(from), abcToScientificNotation(to));
}

var index = {
  abcToScientificNotation,
  scientificToAbcNotation,
  tokenize,
  transpose,
  distance
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/array/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = compact;
exports.permutations = permutations;
exports.range = range;
exports.rotate = rotate;
exports.shuffle = shuffle;
exports.sortedNoteNames = sortedNoteNames;
exports.sortedUniqNoteNames = sortedUniqNoteNames;

var _core = require("@tonaljs/core");

// ascending range
function ascR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = n + b);

  return a;
} // descending range


function descR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = b - n);

  return a;
}
/**
 * Creates a numeric range
 *
 * @param {number} from
 * @param {number} to
 * @return {Array<number>}
 *
 * @example
 * range(-2, 2) // => [-2, -1, 0, 1, 2]
 * range(2, -2) // => [2, 1, 0, -1, -2]
 */


function range(from, to) {
  return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
}
/**
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} array
 * @return {Array} the rotated array
 *
 * @example
 * rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */


function rotate(times, arr) {
  const len = arr.length;
  const n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
/**
 * Return a copy of the array with the null values removed
 * @function
 * @param {Array} array
 * @return {Array}
 *
 * @example
 * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */


function compact(arr) {
  return arr.filter(n => n === 0 || n);
}
/**
 * Sort an array of notes in ascending order. Pitch classes are listed
 * before notes. Any string that is not a note is removed.
 *
 * @param {string[]} notes
 * @return {string[]} sorted array of notes
 *
 * @example
 * sortedNoteNames(['c2', 'c5', 'c1', 'c0', 'c6', 'c'])
 * // => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
 * sortedNoteNames(['c', 'F', 'G', 'a', 'b', 'h', 'J'])
 * // => ['C', 'F', 'G', 'A', 'B']
 */


function sortedNoteNames(notes) {
  const valid = notes.map(n => (0, _core.note)(n)).filter(n => !n.empty);
  return valid.sort((a, b) => a.height - b.height).map(n => n.name);
}
/**
 * Get sorted notes with duplicates removed. Pitch classes are listed
 * before notes.
 *
 * @function
 * @param {string[]} array
 * @return {string[]} unique sorted notes
 *
 * @example
 * Array.sortedUniqNoteNames(['a', 'b', 'c2', '1p', 'p2', 'c2', 'b', 'c', 'c3' ])
 * // => [ 'C', 'A', 'B', 'C2', 'C3' ]
 */


function sortedUniqNoteNames(arr) {
  return sortedNoteNames(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}
/**
 * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array} array
 * @return {Array} the array shuffled
 *
 * @example
 * shuffle(["C", "D", "E", "F"]) // => [...]
 */


function shuffle(arr, rnd = Math.random) {
  let i;
  let t;
  let m = arr.length;

  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}
/**
 * Get all permutations of an array
 *
 * @param {Array} array - the array
 * @return {Array<Array>} an array with all the permutations
 * @example
 * permutations(["a", "b", "c"])) // =>
 * [
 *   ["a", "b", "c"],
 *   ["b", "a", "c"],
 *   ["b", "c", "a"],
 *   ["a", "c", "b"],
 *   ["c", "a", "b"],
 *   ["c", "b", "a"]
 * ]
 */


function permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }

  return permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(arr.map((e, pos) => {
      const newPerm = perm.slice();
      newPerm.splice(pos, 0, arr[0]);
      return newPerm;
    }));
  }, []);
}
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/collection/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = compact;
exports.permutations = permutations;
exports.range = range;
exports.rotate = rotate;
exports.shuffle = shuffle;
exports.default = void 0;

// ascending range
function ascR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = n + b);

  return a;
} // descending range


function descR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = b - n);

  return a;
}
/**
 * Creates a numeric range
 *
 * @param {number} from
 * @param {number} to
 * @return {Array<number>}
 *
 * @example
 * range(-2, 2) // => [-2, -1, 0, 1, 2]
 * range(2, -2) // => [2, 1, 0, -1, -2]
 */


function range(from, to) {
  return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
}
/**
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} collection
 * @return {Array} the rotated collection
 *
 * @example
 * rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */


function rotate(times, arr) {
  const len = arr.length;
  const n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
/**
 * Return a copy of the collection with the null values removed
 * @function
 * @param {Array} collection
 * @return {Array}
 *
 * @example
 * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */


function compact(arr) {
  return arr.filter(n => n === 0 || n);
}
/**
 * Randomizes the order of the specified collection in-place, using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array} collection
 * @return {Array} the collection shuffled
 *
 * @example
 * shuffle(["C", "D", "E", "F"]) // => [...]
 */


function shuffle(arr, rnd = Math.random) {
  let i;
  let t;
  let m = arr.length;

  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}
/**
 * Get all permutations of an collection
 *
 * @param {Array} collection - the collection
 * @return {Array<Array>} an collection with all the permutations
 * @example
 * permutations(["a", "b", "c"])) // =>
 * [
 *   ["a", "b", "c"],
 *   ["b", "a", "c"],
 *   ["b", "c", "a"],
 *   ["a", "c", "b"],
 *   ["c", "a", "b"],
 *   ["c", "b", "a"]
 * ]
 */


function permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }

  return permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(arr.map((e, pos) => {
      const newPerm = perm.slice();
      newPerm.splice(pos, 0, arr[0]);
      return newPerm;
    }));
  }, []);
}

var index = {
  compact,
  permutations,
  range,
  rotate,
  shuffle
};
var _default = index;
exports.default = _default;
},{}],"node_modules/@tonaljs/pcset/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chromaToIntervals = chromaToIntervals;
exports.chromas = chromas;
exports.filter = filter;
exports.get = get;
exports.isEqual = isEqual;
exports.isNoteIncludedIn = isNoteIncludedIn;
exports.isSubsetOf = isSubsetOf;
exports.isSupersetOf = isSupersetOf;
exports.modes = modes;
exports.pcset = exports.includes = exports.EmptyPcset = exports.default = void 0;

var _collection = require("@tonaljs/collection");

var _core = require("@tonaljs/core");

const EmptyPcset = {
  empty: true,
  name: "",
  setNum: 0,
  chroma: "000000000000",
  normalized: "000000000000",
  intervals: []
}; // UTILITIES

exports.EmptyPcset = EmptyPcset;

const setNumToChroma = num => Number(num).toString(2);

const chromaToNumber = chroma => parseInt(chroma, 2);

const REGEX = /^[01]{12}$/;

function isChroma(set) {
  return REGEX.test(set);
}

const isPcsetNum = set => typeof set === "number" && set >= 0 && set <= 4095;

const isPcset = set => set && isChroma(set.chroma);

const cache = {
  [EmptyPcset.chroma]: EmptyPcset
};
/**
 * Get the pitch class set of a collection of notes or set number or chroma
 */

function get(src) {
  const chroma = isChroma(src) ? src : isPcsetNum(src) ? setNumToChroma(src) : Array.isArray(src) ? listToChroma(src) : isPcset(src) ? src.chroma : EmptyPcset.chroma;
  return cache[chroma] = cache[chroma] || chromaToPcset(chroma);
}
/**
 * Use Pcset.properties
 * @function
 * @deprecated
 */


const pcset = (0, _core.deprecate)("Pcset.pcset", "Pcset.get", get);
/**
 * Get pitch class set chroma
 * @function
 * @example
 * Pcset.chroma(["c", "d", "e"]); //=> "101010000000"
 */

exports.pcset = pcset;

const chroma = set => get(set).chroma;
/**
 * Get intervals (from C) of a set
 * @function
 * @example
 * Pcset.intervals(["c", "d", "e"]); //=>
 */


const intervals = set => get(set).intervals;
/**
 * Get pitch class set number
 * @function
 * @example
 * Pcset.num(["c", "d", "e"]); //=> 2192
 */


const num = set => get(set).setNum;

const IVLS = ["1P", "2m", "2M", "3m", "3M", "4P", "5d", "5P", "6m", "6M", "7m", "7M"];
/**
 * @private
 * Get the intervals of a pcset *starting from C*
 * @param {Set} set - the pitch class set
 * @return {IntervalName[]} an array of interval names or an empty array
 * if not a valid pitch class set
 */

function chromaToIntervals(chroma) {
  const intervals = [];

  for (let i = 0; i < 12; i++) {
    // tslint:disable-next-line:curly
    if (chroma.charAt(i) === "1") intervals.push(IVLS[i]);
  }

  return intervals;
}
/**
 * Get a list of all possible pitch class sets (all possible chromas) *having
 * C as root*. There are 2048 different chromas. If you want them with another
 * note you have to transpose it
 *
 * @see http://allthescales.org/
 * @return {Array<PcsetChroma>} an array of possible chromas from '10000000000' to '11111111111'
 */


function chromas() {
  return (0, _collection.range)(2048, 4095).map(setNumToChroma);
}
/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0"
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|string} set - the list of notes or pitchChr of the set
 * @param {boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @return {Array<string>} an array with all the modes of the chroma
 *
 * @example
 * Pcset.modes(["C", "D", "E"]).map(Pcset.intervals)
 */


function modes(set, normalize = true) {
  const pcs = get(set);
  const binary = pcs.chroma.split("");
  return (0, _collection.compact)(binary.map((_, i) => {
    const r = (0, _collection.rotate)(i, binary);
    return normalize && r[0] === "0" ? null : r.join("");
  }));
}
/**
 * Test if two pitch class sets are numentical
 *
 * @param {Array|string} set1 - one of the pitch class sets
 * @param {Array|string} set2 - the other pitch class set
 * @return {boolean} true if they are equal
 * @example
 * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */


function isEqual(s1, s2) {
  return get(s1).setNum === get(s2).setNum;
}
/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function is curryfied.
 *
 * @param {PcsetChroma|NoteName[]} set - the superset to test against (chroma or
 * list of notes)
 * @return{function(PcsetChroma|NoteNames[]): boolean} a function accepting a set
 * to test against (chroma or list of notes)
 * @example
 * const inCMajor = Pcset.isSubsetOf(["C", "E", "G"])
 * inCMajor(["e6", "c4"]) // => true
 * inCMajor(["e6", "c4", "d3"]) // => false
 */


function isSubsetOf(set) {
  const s = get(set).setNum;
  return notes => {
    const o = get(notes).setNum; // tslint:disable-next-line: no-bitwise

    return s && s !== o && (o & s) === o;
  };
}
/**
 * Create a function that test if a collection of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {Set} set - an array of notes or a chroma set string to test against
 * @return {(subset: Set): boolean} a function that given a set
 * returns true if is a subset of the first one
 * @example
 * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */


function isSupersetOf(set) {
  const s = get(set).setNum;
  return notes => {
    const o = get(notes).setNum; // tslint:disable-next-line: no-bitwise

    return s && s !== o && (o | s) === o;
  };
}
/**
 * Test if a given pitch class set includes a note
 *
 * @param {Array<string>} set - the base set to test against
 * @param {string} note - the note to test
 * @return {boolean} true if the note is included in the pcset
 *
 * Can be partially applied
 *
 * @example
 * const isNoteInCMajor = isNoteIncludedIn(['C', 'E', 'G'])
 * isNoteInCMajor('C4') // => true
 * isNoteInCMajor('C#4') // => false
 */


function isNoteIncludedIn(set) {
  const s = get(set);
  return noteName => {
    const n = (0, _core.note)(noteName);
    return s && !n.empty && s.chroma.charAt(n.chroma) === "1";
  };
}
/** @deprecated use: isNoteIncludedIn */


const includes = isNoteIncludedIn;
/**
 * Filter a list with a pitch class set
 *
 * @param {Array|string} set - the pitch class set notes
 * @param {Array|string} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */

exports.includes = includes;

function filter(set) {
  const isIncluded = isNoteIncludedIn(set);
  return notes => {
    return notes.filter(isIncluded);
  };
}

var index = {
  get,
  chroma,
  num,
  intervals,
  chromas,
  isSupersetOf,
  isSubsetOf,
  isNoteIncludedIn,
  isEqual,
  filter,
  modes,
  // deprecated
  pcset
}; //// PRIVATE ////

function chromaRotations(chroma) {
  const binary = chroma.split("");
  return binary.map((_, i) => (0, _collection.rotate)(i, binary).join(""));
}

function chromaToPcset(chroma) {
  const setNum = chromaToNumber(chroma);
  const normalizedNum = chromaRotations(chroma).map(chromaToNumber).filter(n => n >= 2048).sort()[0];
  const normalized = setNumToChroma(normalizedNum);
  const intervals = chromaToIntervals(chroma);
  return {
    empty: false,
    name: "",
    setNum,
    chroma,
    normalized,
    intervals
  };
}

function listToChroma(set) {
  if (set.length === 0) {
    return EmptyPcset.chroma;
  }

  let pitch;
  const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // tslint:disable-next-line:prefer-for-of

  for (let i = 0; i < set.length; i++) {
    pitch = (0, _core.note)(set[i]); // tslint:disable-next-line: curly

    if (pitch.empty) pitch = (0, _core.interval)(set[i]); // tslint:disable-next-line: curly

    if (!pitch.empty) binary[pitch.chroma] = 1;
  }

  return binary.join("");
}

var _default = index;
exports.default = _default;
},{"@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/chord-type/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.addAlias = addAlias;
exports.all = all;
exports.get = get;
exports.keys = keys;
exports.names = names;
exports.removeAll = removeAll;
exports.symbols = symbols;
exports.entries = exports.chordType = exports.default = void 0;

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

/**
 * @private
 * Chord List
 * Source: https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
 * Format: ["intervals", "full name", "abrv1 abrv2"]
 */
const CHORDS = [// ==Major==
["1P 3M 5P", "major", "M ^ "], ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"], ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"], ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"], ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"], ["1P 3M 5P 6M 9M", "sixth/ninth", "6/9 69 M69"], ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"], ["1P 3M 5P 7M 11A", "major seventh sharp eleventh", "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"], // ==Minor==
// '''Normal'''
["1P 3m 5P", "minor", "m min -"], ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"], ["1P 3m 5P 7M", "minor/major seventh", "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7"], ["1P 3m 5P 6M", "minor sixth", "m6 -6"], ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"], ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"], ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"], ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"], // '''Diminished'''
["1P 3m 5d", "diminished", "dim ° o"], ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"], ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"], // ==Dominant/Seventh==
// '''Normal'''
["1P 3M 5P 7m", "dominant seventh", "7 dom"], ["1P 3M 5P 7m 9M", "dominant ninth", "9"], ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"], ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"], // '''Altered'''
["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"], ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"], ["1P 3M 7m 9m", "altered", "alt7"], // '''Suspended'''
["1P 4P 5P", "suspended fourth", "sus4 sus"], ["1P 2M 5P", "suspended second", "sus2"], ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"], ["1P 5P 7m 9M 11P", "eleventh", "11"], ["1P 4P 5P 7m 9m", "suspended fourth flat ninth", "b9sus phryg 7b9sus 7b9sus4"], // ==Other==
["1P 5P", "fifth", "5"], ["1P 3M 5A", "augmented", "aug + +5 ^#5"], ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"], ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"], ["1P 3M 5P 7M 9M 11A", "major sharp eleventh (lydian)", "maj9#11 Δ9#11 ^9#11"], // ==Legacy==
["1P 2M 4P 5P", "", "sus24 sus4add9"], ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"], ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"], ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"], ["1P 3M 5A 7m 9M", "", "9#5 9+"], ["1P 3M 5A 7m 9M 11A", "", "9#5#11"], ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"], ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"], ["1P 3M 5A 9A", "", "+add#9"], ["1P 3M 5A 9M", "", "M#5add9 +add9"], ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"], ["1P 3M 5P 6M 7M 9M", "", "M7add13"], ["1P 3M 5P 6M 9M 11A", "", "69#11"], ["1P 3m 5P 6M 9M", "", "m69 -69"], ["1P 3M 5P 6m 7m", "", "7b6"], ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"], ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"], ["1P 3M 5P 7M 9m", "", "M7b9"], ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"], ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"], ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"], ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"], ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"], ["1P 3M 5P 7m 9A 13M", "", "13#9"], ["1P 3M 5P 7m 9A 13m", "", "7#9b13"], ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"], ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"], ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"], ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"], ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"], ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"], ["1P 3M 5P 7m 9m 13M", "", "13b9"], ["1P 3M 5P 7m 9m 13m", "", "7b9b13"], ["1P 3M 5P 7m 9m 9A", "", "7b9#9"], ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"], ["1P 3M 5P 9m", "", "Maddb9"], ["1P 3M 5d", "", "Mb5"], ["1P 3M 5d 6M 7m 9M", "", "13b5"], ["1P 3M 5d 7M", "", "M7b5"], ["1P 3M 5d 7M 9M", "", "M9b5"], ["1P 3M 5d 7m", "", "7b5"], ["1P 3M 5d 7m 9M", "", "9b5"], ["1P 3M 7m", "", "7no5"], ["1P 3M 7m 13m", "", "7b13"], ["1P 3M 7m 9M", "", "9no5"], ["1P 3M 7m 9M 13M", "", "13no5"], ["1P 3M 7m 9M 13m", "", "9b13"], ["1P 3m 4P 5P", "", "madd4"], ["1P 3m 5P 6m 7M", "", "mMaj7b6"], ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"], ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"], ["1P 3m 5P 9M", "", "madd9"], ["1P 3m 5d 6M 7M", "", "o7M7"], ["1P 3m 5d 7M", "", "oM7"], ["1P 3m 6m 7M", "", "mb6M7"], ["1P 3m 6m 7m", "", "m7#5"], ["1P 3m 6m 7m 9M", "", "m9#5"], ["1P 3m 5A 7m 9M 11P", "", "m11A"], ["1P 3m 6m 9m", "", "mb6b9"], ["1P 2M 3m 5d 7m", "", "m9b5"], ["1P 4P 5A 7M", "", "M7#5sus4"], ["1P 4P 5A 7M 9M", "", "M9#5sus4"], ["1P 4P 5A 7m", "", "7#5sus4"], ["1P 4P 5P 7M", "", "M7sus4"], ["1P 4P 5P 7M 9M", "", "M9sus4"], ["1P 4P 5P 7m 9M", "", "9sus4 9sus"], ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"], ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"], ["1P 4P 7m 10m", "", "4 quartal"], ["1P 5P 7m 9m 11P", "", "11b9"]];
const NoChordType = { ..._pcset.EmptyPcset,
  name: "",
  quality: "Unknown",
  intervals: [],
  aliases: []
};
let dictionary = [];
let index = {};
/**
 * Given a chord name or chroma, return the chord properties
 * @param {string} source - chord name or pitch class set chroma
 * @example
 * import { get } from 'tonaljs/chord-type'
 * get('major') // => { name: 'major', ... }
 */

function get(type) {
  return index[type] || NoChordType;
}

const chordType = (0, _core.deprecate)("ChordType.chordType", "ChordType.get", get);
/**
 * Get all chord (long) names
 */

exports.chordType = chordType;

function names() {
  return dictionary.map(chord => chord.name).filter(x => x);
}
/**
 * Get all chord symbols
 */


function symbols() {
  return dictionary.map(chord => chord.aliases[0]).filter(x => x);
}
/**
 * Keys used to reference chord types
 */


function keys() {
  return Object.keys(index);
}
/**
 * Return a list of all chord types
 */


function all() {
  return dictionary.slice();
}

const entries = (0, _core.deprecate)("ChordType.entries", "ChordType.all", all);
/**
 * Clear the dictionary
 */

exports.entries = entries;

function removeAll() {
  dictionary = [];
  index = {};
}
/**
 * Add a chord to the dictionary.
 * @param intervals
 * @param aliases
 * @param [fullName]
 */


function add(intervals, aliases, fullName) {
  const quality = getQuality(intervals);
  const chord = { ...(0, _pcset.get)(intervals),
    name: fullName || "",
    quality,
    intervals,
    aliases
  };
  dictionary.push(chord);

  if (chord.name) {
    index[chord.name] = chord;
  }

  index[chord.setNum] = chord;
  index[chord.chroma] = chord;
  chord.aliases.forEach(alias => addAlias(chord, alias));
}

function addAlias(chord, alias) {
  index[alias] = chord;
}

function getQuality(intervals) {
  const has = interval => intervals.indexOf(interval) !== -1;

  return has("5A") ? "Augmented" : has("3M") ? "Major" : has("5d") ? "Diminished" : has("3m") ? "Minor" : "Unknown";
}

CHORDS.forEach(([ivls, fullName, names]) => add(ivls.split(" "), names.split(" "), fullName));
dictionary.sort((a, b) => a.setNum - b.setNum);
var index$1 = {
  names,
  symbols,
  get,
  all,
  add,
  removeAll,
  keys,
  // deprecated
  entries,
  chordType
};
var _default = index$1;
exports.default = _default;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js"}],"node_modules/@tonaljs/chord-detect/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detect = detect;
exports.default = void 0;

var _chordType = require("@tonaljs/chord-type");

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

const namedSet = notes => {
  const pcToName = notes.reduce((record, n) => {
    const chroma = (0, _core.note)(n).chroma;

    if (chroma !== undefined) {
      record[chroma] = record[chroma] || (0, _core.note)(n).name;
    }

    return record;
  }, {});
  return chroma => pcToName[chroma];
};

function detect(source) {
  const notes = source.map(n => (0, _core.note)(n).pc).filter(x => x);

  if (_core.note.length === 0) {
    return [];
  }

  const found = findExactMatches(notes, 1);
  return found.filter(chord => chord.weight).sort((a, b) => b.weight - a.weight).map(chord => chord.name);
}

function findExactMatches(notes, weight) {
  const tonic = notes[0];
  const tonicChroma = (0, _core.note)(tonic).chroma;
  const noteName = namedSet(notes); // we need to test all chormas to get the correct baseNote

  const allModes = (0, _pcset.modes)(notes, false);
  const found = [];
  allModes.forEach((mode, index) => {
    // some chords could have the same chroma but different interval spelling
    const chordTypes = (0, _chordType.all)().filter(chordType => chordType.chroma === mode);
    chordTypes.forEach(chordType => {
      const chordName = chordType.aliases[0];
      const baseNote = noteName(index);
      const isInversion = index !== tonicChroma;

      if (isInversion) {
        found.push({
          weight: 0.5 * weight,
          name: `${baseNote}${chordName}/${tonic}`
        });
      } else {
        found.push({
          weight: 1 * weight,
          name: `${baseNote}${chordName}`
        });
      }
    });
  });
  return found;
}

var index = {
  detect
};
var _default = index;
exports.default = _default;
},{"@tonaljs/chord-type":"node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js"}],"node_modules/@tonaljs/scale-type/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.addAlias = addAlias;
exports.all = all;
exports.get = get;
exports.keys = keys;
exports.names = names;
exports.removeAll = removeAll;
exports.scaleType = exports.entries = exports.NoScaleType = exports.default = void 0;

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

// SCALES
// Format: ["intervals", "name", "alias1", "alias2", ...]
const SCALES = [// 5-note scales
["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"], ["1P 3M 4P 5P 7M", "ionian pentatonic"], ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"], ["1P 2M 4P 5P 6M", "ritusen"], ["1P 2M 4P 5P 7m", "egyptian"], ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"], ["1P 3m 4P 5P 6m", "vietnamese 1"], ["1P 2m 3m 5P 6m", "pelog"], ["1P 2m 4P 5P 6m", "kumoijoshi"], ["1P 2M 3m 5P 6m", "hirajoshi"], ["1P 2m 4P 5d 7m", "iwato"], ["1P 2m 4P 5P 7m", "in-sen"], ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"], ["1P 3m 4P 6m 7m", "malkos raga"], ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"], ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"], ["1P 3m 4P 5P 6M", "minor six pentatonic"], ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"], ["1P 2M 3M 5P 6m", "flat six pentatonic"], ["1P 2m 3M 5P 6M", "scriabin"], ["1P 3M 5d 6m 7m", "whole tone pentatonic"], ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"], ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"], ["1P 3m 4P 5P 7M", "minor #7M pentatonic"], ["1P 3m 4d 5d 7m", "super locrian pentatonic"], // 6-note scales
["1P 2M 3m 4P 5P 7M", "minor hexatonic"], ["1P 2A 3M 5P 5A 7M", "augmented"], ["1P 2M 3m 3M 5P 6M", "major blues"], ["1P 2M 4P 5P 6M 7m", "piongio"], ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"], ["1P 2M 3M 4A 6M 7m", "prometheus"], ["1P 2m 3M 5d 6m 7m", "mystery #1"], ["1P 2m 3M 4P 5A 6M", "six tone symmetric"], ["1P 2M 3M 4A 5A 7m", "whole tone", "messiaen's mode #1"], ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"], ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"], // 7-note scales
["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"], ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"], ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"], ["1P 2m 3m 4d 5d 6m 7m", "altered", "super locrian", "diminished whole tone", "pomeroy"], ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"], ["1P 2M 3M 4P 5P 6m 7m", "mixolydian b6", "melodic minor fifth mode", "hindu"], ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"], ["1P 2M 3M 4A 5P 6M 7M", "lydian"], ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"], ["1P 2m 3m 4P 5P 6M 7m", "dorian b2", "phrygian #6", "melodic minor second mode"], ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"], ["1P 2m 3m 4P 5d 6m 7m", "locrian"], ["1P 2m 3m 4d 5d 6m 7d", "ultralocrian", "superlocrian bb7", "·superlocrian diminished"], ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"], ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"], ["1P 2M 3m 5d 5P 6M 7m", "romanian minor"], ["1P 2M 3m 4A 5P 6M 7m", "dorian #4"], ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"], ["1P 2m 3m 4P 5P 6m 7m", "phrygian"], ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"], ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"], ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"], ["1P 2m 3m 4P 5P 6m 7M", "balinese"], ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"], ["1P 2M 3m 4P 5P 6m 7m", "aeolian", "minor"], ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"], ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"], ["1P 2M 3m 4P 5P 6M 7m", "dorian"], ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"], ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"], ["1P 2m 3M 4P 5d 6M 7m", "oriental"], ["1P 2m 3m 3M 4A 5P 7m", "flamenco"], ["1P 2m 3m 4A 5P 6m 7M", "todi raga"], ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"], ["1P 2m 3M 4P 5d 6m 7M", "persian"], ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"], ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"], ["1P 2M 3M 4P 5A 6M 7M", "major augmented", "major #5", "ionian augmented", "ionian #5"], ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"], // 8-note scales
["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"], ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"], ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"], ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"], ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"], ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"], ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"], ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"], ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"], ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"], ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"], ["1P 2m 3m 3M 4A 5P 6M 7m", "half-whole diminished", "dominant diminished", "messiaen's mode #2"], ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"], ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"], // 9-note scales
["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"], ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"], // 10-note scales
["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"], // 12-note scales
["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]];
const NoScaleType = { ..._pcset.EmptyPcset,
  intervals: [],
  aliases: []
};
exports.NoScaleType = NoScaleType;
let dictionary = [];
let index = {};

function names() {
  return dictionary.map(scale => scale.name);
}
/**
 * Given a scale name or chroma, return the scale properties
 *
 * @param {string} type - scale name or pitch class set chroma
 * @example
 * import { get } from 'tonaljs/scale-type'
 * get('major') // => { name: 'major', ... }
 */


function get(type) {
  return index[type] || NoScaleType;
}

const scaleType = (0, _core.deprecate)("ScaleDictionary.scaleType", "ScaleType.get", get);
/**
 * Return a list of all scale types
 */

exports.scaleType = scaleType;

function all() {
  return dictionary.slice();
}

const entries = (0, _core.deprecate)("ScaleDictionary.entries", "ScaleType.all", all);
/**
 * Keys used to reference scale types
 */

exports.entries = entries;

function keys() {
  return Object.keys(index);
}
/**
 * Clear the dictionary
 */


function removeAll() {
  dictionary = [];
  index = {};
}
/**
 * Add a scale into dictionary
 * @param intervals
 * @param name
 * @param aliases
 */


function add(intervals, name, aliases = []) {
  const scale = { ...(0, _pcset.get)(intervals),
    name,
    intervals,
    aliases
  };
  dictionary.push(scale);
  index[scale.name] = scale;
  index[scale.setNum] = scale;
  index[scale.chroma] = scale;
  scale.aliases.forEach(alias => addAlias(scale, alias));
  return scale;
}

function addAlias(scale, alias) {
  index[alias] = scale;
}

SCALES.forEach(([ivls, name, ...aliases]) => add(ivls.split(" "), name, aliases));
var index$1 = {
  names,
  get,
  all,
  add,
  removeAll,
  keys,
  // deprecated
  entries,
  scaleType
};
var _default = index$1;
exports.default = _default;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js"}],"node_modules/@tonaljs/chord/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chordScales = chordScales;
exports.extended = extended;
exports.get = get;
exports.getChord = getChord;
exports.reduced = reduced;
exports.tokenize = tokenize;
exports.transpose = transpose;
Object.defineProperty(exports, "detect", {
  enumerable: true,
  get: function () {
    return _chordDetect.detect;
  }
});
exports.chord = exports.default = void 0;

var _chordDetect = require("@tonaljs/chord-detect");

var _chordType = require("@tonaljs/chord-type");

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

var _scaleType = require("@tonaljs/scale-type");

const NoChord = {
  empty: true,
  name: "",
  symbol: "",
  root: "",
  rootDegree: 0,
  type: "",
  tonic: null,
  setNum: NaN,
  quality: "Unknown",
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
}; // 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)

const NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic and chord type
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {string} name - the chord name
 * @return {Array} an array with [tonic, type]
 * @example
 * tokenize("Cmaj7") // => [ "C", "maj7" ]
 * tokenize("C7") // => [ "C", "7" ]
 * tokenize("mMaj7") // => [ null, "mMaj7" ]
 * tokenize("Cnonsense") // => [ null, "nonsense" ]
 */

function tokenize(name) {
  const [letter, acc, oct, type] = (0, _core.tokenizeNote)(name);

  if (letter === "") {
    return ["", name];
  } // aug is augmented (see https://github.com/danigb/tonal/issues/55)


  if (letter === "A" && type === "ug") {
    return ["", "aug"];
  } // see: https://github.com/tonaljs/tonal/issues/70


  if (!type && (oct === "4" || oct === "5")) {
    return [letter + acc, oct];
  }

  if (NUM_TYPES.test(oct)) {
    return [letter + acc, oct + type];
  } else {
    return [letter + acc + oct, type];
  }
}
/**
 * Get a Chord from a chord name.
 */


function get(src) {
  if (src === "") {
    return NoChord;
  }

  if (Array.isArray(src) && src.length === 2) {
    return getChord(src[1], src[0]);
  } else {
    const [tonic, type] = tokenize(src);
    const chord = getChord(type, tonic);
    return chord.empty ? getChord(src) : chord;
  }
}
/**
 * Get chord properties
 *
 * @param typeName - the chord type name
 * @param [tonic] - Optional tonic
 * @param [root]  - Optional root (requires a tonic)
 */


function getChord(typeName, optionalTonic, optionalRoot) {
  const type = (0, _chordType.get)(typeName);
  const tonic = (0, _core.note)(optionalTonic || "");
  const root = (0, _core.note)(optionalRoot || "");

  if (type.empty || optionalTonic && tonic.empty || optionalRoot && root.empty) {
    return NoChord;
  }

  const rootInterval = (0, _core.distance)(tonic.pc, root.pc);
  const rootDegree = type.intervals.indexOf(rootInterval) + 1;

  if (!root.empty && !rootDegree) {
    return NoChord;
  }

  const intervals = Array.from(type.intervals);

  for (let i = 1; i < rootDegree; i++) {
    const num = intervals[0][0];
    const quality = intervals[0][1];
    const newNum = parseInt(num, 10) + 7;
    intervals.push(`${newNum}${quality}`);
    intervals.shift();
  }

  const notes = tonic.empty ? [] : intervals.map(i => (0, _core.transpose)(tonic, i));
  typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
  const symbol = `${tonic.empty ? "" : tonic.pc}${typeName}${root.empty || rootDegree <= 1 ? "" : "/" + root.pc}`;
  const name = `${optionalTonic ? tonic.pc + " " : ""}${type.name}${rootDegree > 1 && optionalRoot ? " over " + root.pc : ""}`;
  return { ...type,
    name,
    symbol,
    type: type.name,
    root: root.name,
    intervals,
    rootDegree,
    tonic: tonic.name,
    notes
  };
}

const chord = (0, _core.deprecate)("Chord.chord", "Chord.get", get);
/**
 * Transpose a chord name
 *
 * @param {string} chordName - the chord name
 * @return {string} the transposed chord
 *
 * @example
 * transpose('Dm7', 'P4') // => 'Gm7
 */

exports.chord = chord;

function transpose(chordName, interval) {
  const [tonic, type] = tokenize(chordName);

  if (!tonic) {
    return chordName;
  }

  return (0, _core.transpose)(tonic, interval) + type;
}
/**
 * Get all scales where the given chord fits
 *
 * @example
 * chordScales('C7b9')
 * // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
 */


function chordScales(name) {
  const s = get(name);
  const isChordIncluded = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _scaleType.all)().filter(scale => isChordIncluded(scale.chroma)).map(scale => scale.name);
}
/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @example
 * extended("CMaj7")
 * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
 */


function extended(chordName) {
  const s = get(chordName);
  const isSuperset = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => isSuperset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
}
/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @example
 */


function reduced(chordName) {
  const s = get(chordName);
  const isSubset = (0, _pcset.isSubsetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => isSubset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
}

var index = {
  getChord,
  get,
  detect: _chordDetect.detect,
  chordScales,
  extended,
  reduced,
  tokenize,
  transpose,
  // deprecate
  chord
};
var _default = index;
exports.default = _default;
},{"@tonaljs/chord-detect":"node_modules/@tonaljs/chord-detect/dist/index.es.js","@tonaljs/chord-type":"node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/scale-type":"node_modules/@tonaljs/scale-type/dist/index.es.js"}],"node_modules/@tonaljs/duration-value/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.shorthands = shorthands;
exports.value = exports.fraction = exports.default = void 0;
// source: https://en.wikipedia.org/wiki/Note_value
const DATA = [[0.125, "dl", ["large", "duplex longa", "maxima", "octuple", "octuple whole"]], [0.25, "l", ["long", "longa"]], [0.5, "d", ["double whole", "double", "breve"]], [1, "w", ["whole", "semibreve"]], [2, "h", ["half", "minim"]], [4, "q", ["quarter", "crotchet"]], [8, "e", ["eighth", "quaver"]], [16, "s", ["sixteenth", "semiquaver"]], [32, "t", ["thirty-second", "demisemiquaver"]], [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]], [128, "h", ["hundred twenty-eighth"]], [256, "th", ["two hundred fifty-sixth"]]];
const VALUES = [];
DATA.forEach(([denominator, shorthand, names]) => add(denominator, shorthand, names));
const NoDuration = {
  empty: true,
  name: "",
  value: 0,
  fraction: [0, 0],
  shorthand: "",
  dots: "",
  names: []
};

function names() {
  return VALUES.reduce((names, duration) => {
    duration.names.forEach(name => names.push(name));
    return names;
  }, []);
}

function shorthands() {
  return VALUES.map(dur => dur.shorthand);
}

const REGEX = /^([^.]+)(\.*)$/;

function get(name) {
  const [_, simple, dots] = REGEX.exec(name) || [];
  const base = VALUES.find(dur => dur.shorthand === simple || dur.names.includes(simple));

  if (!base) {
    return NoDuration;
  }

  const fraction = calcDots(base.fraction, dots.length);
  const value = fraction[0] / fraction[1];
  return { ...base,
    name,
    dots,
    value,
    fraction
  };
}

const value = name => get(name).value;

exports.value = value;

const fraction = name => get(name).fraction;

exports.fraction = fraction;
var index = {
  names,
  shorthands,
  get,
  value,
  fraction
}; //// PRIVATE ////

function add(denominator, shorthand, names) {
  VALUES.push({
    empty: false,
    dots: "",
    name: "",
    value: 1 / denominator,
    fraction: denominator < 1 ? [1 / denominator, 1] : [1, denominator],
    shorthand,
    names
  });
}

function calcDots(fraction, dots) {
  const pow = Math.pow(2, dots);
  let numerator = fraction[0] * pow;
  let denominator = fraction[1] * pow;
  const base = numerator; // add fractions

  for (let i = 0; i < dots; i++) {
    numerator += base / Math.pow(2, i + 1);
  } // simplify


  while (numerator % 2 === 0 && denominator % 2 === 0) {
    numerator /= 2;
    denominator /= 2;
  }

  return [numerator, denominator];
}

var _default = index;
exports.default = _default;
},{}],"node_modules/@tonaljs/interval/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromSemitones = fromSemitones;
exports.invert = invert;
exports.names = names;
exports.simplify = simplify;
exports.transposeFifths = transposeFifths;
exports.substract = exports.semitones = exports.quality = exports.num = exports.name = exports.get = exports.distance = exports.addTo = exports.add = exports.default = void 0;

var _core = require("@tonaljs/core");

/**
 * Get the natural list of names
 */
function names() {
  return "1P 2M 3M 4P 5P 6m 7m".split(" ");
}
/**
 * Get properties of an interval
 *
 * @function
 * @example
 * Interval.get('P4') // => {"alt": 0,  "dir": 1,  "name": "4P", "num": 4, "oct": 0, "q": "P", "semitones": 5, "simple": 4, "step": 3, "type": "perfectable"}
 */


const get = _core.interval;
/**
 * Get name of an interval
 *
 * @function
 * @example
 * Interval.name('4P') // => "4P"
 * Interval.name('P4') // => "4P"
 * Interval.name('C4') // => ""
 */

exports.get = get;

const name = name => (0, _core.interval)(name).name;
/**
 * Get semitones of an interval
 * @function
 * @example
 * Interval.semitones('P4') // => 5
 */


exports.name = name;

const semitones = name => (0, _core.interval)(name).semitones;
/**
 * Get quality of an interval
 * @function
 * @example
 * Interval.quality('P4') // => "P"
 */


exports.semitones = semitones;

const quality = name => (0, _core.interval)(name).q;
/**
 * Get number of an interval
 * @function
 * @example
 * Interval.num('P4') // => 4
 */


exports.quality = quality;

const num = name => (0, _core.interval)(name).num;
/**
 * Get the simplified version of an interval.
 *
 * @function
 * @param {string} interval - the interval to simplify
 * @return {string} the simplified interval
 *
 * @example
 * Interval.simplify("9M") // => "2M"
 * Interval.simplify("2M") // => "2M"
 * Interval.simplify("-2M") // => "7m"
 * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
 * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
 */


exports.num = num;

function simplify(name) {
  const i = (0, _core.interval)(name);
  return i.empty ? "" : i.simple + i.q;
}
/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {string} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {string} the inverted interval
 *
 * @example
 * Interval.invert("3m") // => "6M"
 * Interval.invert("2M") // => "7m"
 */


function invert(name) {
  const i = (0, _core.interval)(name);

  if (i.empty) {
    return "";
  }

  const step = (7 - i.step) % 7;
  const alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
  return (0, _core.interval)({
    step,
    alt,
    oct: i.oct,
    dir: i.dir
  }).name;
} // interval numbers


const IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7]; // interval qualities

const IQ = "P m M m M P d P m M m M".split(" ");
/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it's arbitrary, but deterministic.
 *
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {string} the interval name
 * @example
 * Interval.fromSemitones(7) // => "5P"
 * Interval.fromSemitones(-7) // => "-5P"
 */

function fromSemitones(semitones) {
  const d = semitones < 0 ? -1 : 1;
  const n = Math.abs(semitones);
  const c = n % 12;
  const o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
}
/**
 * Find interval between two notes
 *
 * @example
 * Interval.distance("C4", "G4"); // => "5P"
 */


const distance = _core.distance;
/**
 * Adds two intervals
 *
 * @function
 * @param {string} interval1
 * @param {string} interval2
 * @return {string} the added interval name
 * @example
 * Interval.add("3m", "5P") // => "7m"
 */

exports.distance = distance;
const add = combinator((a, b) => [a[0] + b[0], a[1] + b[1]]);
/**
 * Returns a function that adds an interval
 *
 * @function
 * @example
 * ['1P', '2M', '3M'].map(Interval.addTo('5P')) // => ["5P", "6M", "7M"]
 */

exports.add = add;

const addTo = interval => other => add(interval, other);
/**
 * Subtracts two intervals
 *
 * @function
 * @param {string} minuendInterval
 * @param {string} subtrahendInterval
 * @return {string} the substracted interval name
 * @example
 * Interval.substract('5P', '3M') // => '3m'
 * Interval.substract('3M', '5P') // => '-3m'
 */


exports.addTo = addTo;
const substract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);
exports.substract = substract;

function transposeFifths(interval, fifths) {
  const ivl = get(interval);
  if (ivl.empty) return "";
  const [nFifths, nOcts, dir] = ivl.coord;
  return (0, _core.coordToInterval)([nFifths + fifths, nOcts, dir]).name;
}

var index = {
  names,
  get,
  name,
  num,
  semitones,
  quality,
  fromSemitones,
  distance,
  invert,
  simplify,
  add,
  addTo,
  substract,
  transposeFifths
};

function combinator(fn) {
  return (a, b) => {
    const coordA = (0, _core.interval)(a).coord;
    const coordB = (0, _core.interval)(b).coord;

    if (coordA && coordB) {
      const coord = fn(coordA, coordB);
      return (0, _core.coordToInterval)(coord).name;
    }
  };
}

var _default = index;
exports.default = _default;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/midi/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.freqToMidi = freqToMidi;
exports.isMidi = isMidi;
exports.midiToFreq = midiToFreq;
exports.midiToNoteName = midiToNoteName;
exports.toMidi = toMidi;
exports.default = void 0;

var _core = require("@tonaljs/core");

function isMidi(arg) {
  return +arg >= 0 && +arg <= 127;
}
/**
 * Get the note midi number (a number between 0 and 127)
 *
 * It returns undefined if not valid note name
 *
 * @function
 * @param {string|number} note - the note name or midi number
 * @return {Integer} the midi number or undefined if not valid note
 * @example
 * import { toMidi } from '@tonaljs/midi'
 * toMidi("C4") // => 60
 * toMidi(60) // => 60
 * toMidi('60') // => 60
 */


function toMidi(note$1) {
  if (isMidi(note$1)) {
    return +note$1;
  }

  const n = (0, _core.note)(note$1);
  return n.empty ? null : n.midi;
}
/**
 * Get the frequency in hertzs from midi number
 *
 * @param {number} midi - the note midi number
 * @param {number} [tuning = 440] - A4 tuning frequency in Hz (440 by default)
 * @return {number} the frequency or null if not valid note midi
 * @example
 * import { midiToFreq} from '@tonaljs/midi'
 * midiToFreq(69) // => 440
 */


function midiToFreq(midi, tuning = 440) {
  return Math.pow(2, (midi - 69) / 12) * tuning;
}

const L2 = Math.log(2);
const L440 = Math.log(440);
/**
 * Get the midi number from a frequency in hertz. The midi number can
 * contain decimals (with two digits precission)
 *
 * @param {number} frequency
 * @return {number}
 * @example
 * import { freqToMidi} from '@tonaljs/midi'
 * freqToMidi(220)); //=> 57
 * freqToMidi(261.62)); //=> 60
 * freqToMidi(261)); //=> 59.96
 */

function freqToMidi(freq) {
  const v = 12 * (Math.log(freq) - L440) / L2 + 69;
  return Math.round(v * 100) / 100;
}

const SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
const FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
 * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * import { midiToNoteName } from '@tonaljs/midi'
 * midiToNoteName(61) // => "Db4"
 * midiToNoteName(61, { pitchClass: true }) // => "Db"
 * midiToNoteName(61, { sharps: true }) // => "C#4"
 * midiToNoteName(61, { pitchClass: true, sharps: true }) // => "C#"
 * // it rounds to nearest note
 * midiToNoteName(61.7) // => "D4"
 */

function midiToNoteName(midi, options = {}) {
  if (isNaN(midi) || midi === -Infinity || midi === Infinity) return "";
  midi = Math.round(midi);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];

  if (options.pitchClass) {
    return pc;
  }

  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}

var index = {
  isMidi,
  toMidi,
  midiToFreq,
  midiToNoteName,
  freqToMidi
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/note/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enharmonic = enharmonic;
exports.fromFreq = fromFreq;
exports.fromFreqSharps = fromFreqSharps;
exports.fromMidi = fromMidi;
exports.fromMidiSharps = fromMidiSharps;
exports.names = names;
exports.sortedNames = sortedNames;
exports.sortedUniqNames = sortedUniqNames;
exports.transposeFifths = transposeFifths;
exports.transposeFrom = exports.transposeBy = exports.transpose = exports.trFrom = exports.trFifths = exports.trBy = exports.tr = exports.simplify = exports.pitchClass = exports.octave = exports.name = exports.midi = exports.get = exports.freq = exports.descending = exports.chroma = exports.ascending = exports.accidentals = exports.default = void 0;

var _core = require("@tonaljs/core");

var _midi = require("@tonaljs/midi");

const NAMES = ["C", "D", "E", "F", "G", "A", "B"];

const toName = n => n.name;

const onlyNotes = array => array.map(_core.note).filter(n => !n.empty);
/**
 * Return the natural note names without octave
 * @function
 * @example
 * Note.names(); // => ["C", "D", "E", "F", "G", "A", "B"]
 */


function names(array) {
  if (array === undefined) {
    return NAMES.slice();
  } else if (!Array.isArray(array)) {
    return [];
  } else {
    return onlyNotes(array).map(toName);
  }
}
/**
 * Get a note from a note name
 *
 * @function
 * @example
 * Note.get('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */


const get = _core.note;
/**
 * Get the note name
 * @function
 */

exports.get = get;

const name = note => get(note).name;
/**
 * Get the note pitch class name
 * @function
 */


exports.name = name;

const pitchClass = note => get(note).pc;
/**
 * Get the note accidentals
 * @function
 */


exports.pitchClass = pitchClass;

const accidentals = note => get(note).acc;
/**
 * Get the note octave
 * @function
 */


exports.accidentals = accidentals;

const octave = note => get(note).oct;
/**
 * Get the note midi
 * @function
 */


exports.octave = octave;

const midi = note => get(note).midi;
/**
 * Get the note midi
 * @function
 */


exports.midi = midi;

const freq = note => get(note).freq;
/**
 * Get the note chroma
 * @function
 */


exports.freq = freq;

const chroma = note => get(note).chroma;
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 *
 * @function
 * @param {number} midi - the midi note number
 * @return {string} the note name
 * @example
 * Note.fromMidi(61) // => "Db4"
 * Note.fromMidi(61.7) // => "D4"
 */


exports.chroma = chroma;

function fromMidi(midi) {
  return (0, _midi.midiToNoteName)(midi);
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 */


function fromFreq(freq) {
  return (0, _midi.midiToNoteName)((0, _midi.freqToMidi)(freq));
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 */


function fromFreqSharps(freq) {
  return (0, _midi.midiToNoteName)((0, _midi.freqToMidi)(freq), {
    sharps: true
  });
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 *
 * @function
 * @param {number} midi - the midi note number
 * @return {string} the note name
 * @example
 * Note.fromMidiSharps(61) // => "C#4"
 */


function fromMidiSharps(midi) {
  return (0, _midi.midiToNoteName)(midi, {
    sharps: true
  });
}
/**
 * Transpose a note by an interval
 */


const transpose = _core.transpose;
exports.transpose = transpose;
const tr = _core.transpose;
/**
 * Transpose by an interval.
 * @function
 * @param {string} interval
 * @return {function} a function that transposes by the given interval
 * @example
 * ["C", "D", "E"].map(Note.transposeBy("5P"));
 * // => ["G", "A", "B"]
 */

exports.tr = tr;

const transposeBy = interval => note => transpose(note, interval);

exports.transposeBy = transposeBy;
const trBy = transposeBy;
/**
 * Transpose from a note
 * @function
 * @param {string} note
 * @return {function}  a function that transposes the the note by an interval
 * ["1P", "3M", "5P"].map(Note.transposeFrom("C"));
 * // => ["C", "E", "G"]
 */

exports.trBy = trBy;

const transposeFrom = note => interval => transpose(note, interval);

exports.transposeFrom = transposeFrom;
const trFrom = transposeFrom;
/**
 * Transpose a note by a number of perfect fifths.
 *
 * @function
 * @param {string} note - the note name
 * @param {number} fifhts - the number of fifths
 * @return {string} the transposed note name
 *
 * @example
 * import { transposeFifths } from "@tonaljs/note"
 * transposeFifths("G4", 1) // => "D"
 * [0, 1, 2, 3, 4].map(fifths => transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
 */

exports.trFrom = trFrom;

function transposeFifths(noteName, fifths) {
  const note = get(noteName);

  if (note.empty) {
    return "";
  }

  const [nFifths, nOcts] = note.coord;
  const transposed = nOcts === undefined ? (0, _core.coordToNote)([nFifths + fifths]) : (0, _core.coordToNote)([nFifths + fifths, nOcts]);
  return transposed.name;
}

const trFifths = transposeFifths;
exports.trFifths = trFifths;

const ascending = (a, b) => a.height - b.height;

exports.ascending = ascending;

const descending = (a, b) => b.height - a.height;

exports.descending = descending;

function sortedNames(notes, comparator) {
  comparator = comparator || ascending;
  return onlyNotes(notes).sort(comparator).map(toName);
}

function sortedUniqNames(notes) {
  return sortedNames(notes, ascending).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}
/**
 * Simplify a note
 *
 * @function
 * @param {string} note - the note to be simplified
 * - sameAccType: default true. Use same kind of accidentals that source
 * @return {string} the simplified note or '' if not valid note
 * @example
 * simplify("C##") // => "D"
 * simplify("C###") // => "D#"
 * simplify("C###")
 * simplify("B#4") // => "C5"
 */


const simplify = noteName => {
  const note = get(noteName);

  if (note.empty) {
    return "";
  }

  return (0, _midi.midiToNoteName)(note.midi || note.chroma, {
    sharps: note.alt > 0,
    pitchClass: note.midi === null
  });
};
/**
 * Get enharmonic of a note
 *
 * @function
 * @param {string} note
 * @param [string] - [optional] Destination pitch class
 * @return {string} the enharmonic note name or '' if not valid note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enharmonic("C") // => "C"
 * Note.enharmonic("F2","E#") // => "E#2"
 */


exports.simplify = simplify;

function enharmonic(noteName, destName) {
  const src = get(noteName);

  if (src.empty) {
    return "";
  } // destination: use given or generate one


  const dest = get(destName || (0, _midi.midiToNoteName)(src.midi || src.chroma, {
    sharps: src.alt < 0,
    pitchClass: true
  })); // ensure destination is valid

  if (dest.empty || dest.chroma !== src.chroma) {
    return "";
  } // if src has no octave, no need to calculate anything else


  if (src.oct === undefined) {
    return dest.pc;
  } // detect any octave overflow


  const srcChroma = src.chroma - src.alt;
  const destChroma = dest.chroma - dest.alt;
  const destOctOffset = srcChroma > 11 || destChroma < 0 ? -1 : srcChroma < 0 || destChroma > 11 ? +1 : 0; // calculate the new octave

  const destOct = src.oct + destOctOffset;
  return dest.pc + destOct;
}

var index = {
  names,
  get,
  name,
  pitchClass,
  accidentals,
  octave,
  midi,
  ascending,
  descending,
  sortedNames,
  sortedUniqNames,
  fromMidi,
  fromMidiSharps,
  freq,
  fromFreq,
  fromFreqSharps,
  chroma,
  transpose,
  tr,
  transposeBy,
  trBy,
  transposeFrom,
  trFrom,
  transposeFifths,
  trFifths,
  simplify,
  enharmonic
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/midi":"node_modules/@tonaljs/midi/dist/index.es.js"}],"node_modules/@tonaljs/roman-numeral/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.tokenize = tokenize;
exports.default = void 0;

var _core = require("@tonaljs/core");

const NoRomanNumeral = {
  empty: true,
  name: "",
  chordType: ""
};
const cache = {};
/**
 * Get properties of a roman numeral string
 *
 * @function
 * @param {string} - the roman numeral string (can have type, like: Imaj7)
 * @return {Object} - the roman numeral properties
 * @param {string} name - the roman numeral (tonic)
 * @param {string} type - the chord type
 * @param {string} num - the number (1 = I, 2 = II...)
 * @param {boolean} major - major or not
 *
 * @example
 * romanNumeral("VIIb5") // => { name: "VII", type: "b5", num: 7, major: true }
 */

function get(src) {
  return typeof src === "string" ? cache[src] || (cache[src] = parse(src)) : typeof src === "number" ? get(NAMES[src] || "") : (0, _core.isPitch)(src) ? fromPitch(src) : (0, _core.isNamed)(src) ? get(src.name) : NoRomanNumeral;
}

const romanNumeral = (0, _core.deprecate)("RomanNumeral.romanNumeral", "RomanNumeral.get", get);
/**
 * Get roman numeral names
 *
 * @function
 * @param {boolean} [isMajor=true]
 * @return {Array<String>}
 *
 * @example
 * names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
 */

function names(major = true) {
  return (major ? NAMES : NAMES_MINOR).slice();
}

function fromPitch(pitch) {
  return get((0, _core.altToAcc)(pitch.alt) + NAMES[pitch.step]);
}

const REGEX = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;

function tokenize(str) {
  return REGEX.exec(str) || ["", "", "", ""];
}

const ROMANS = "I II III IV V VI VII";
const NAMES = ROMANS.split(" ");
const NAMES_MINOR = ROMANS.toLowerCase().split(" ");

function parse(src) {
  const [name, acc, roman, chordType] = tokenize(src);

  if (!roman) {
    return NoRomanNumeral;
  }

  const upperRoman = roman.toUpperCase();
  const step = NAMES.indexOf(upperRoman);
  const alt = (0, _core.accToAlt)(acc);
  const dir = 1;
  return {
    empty: false,
    name,
    roman,
    interval: (0, _core.interval)({
      step,
      alt,
      dir
    }).name,
    acc,
    chordType,
    alt,
    step,
    major: roman === upperRoman,
    oct: 0,
    dir
  };
}

var index = {
  names,
  get,
  // deprecated
  romanNumeral
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/key/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.majorKey = majorKey;
exports.majorTonicFromKeySignature = majorTonicFromKeySignature;
exports.minorKey = minorKey;
exports.default = void 0;

var _core = require("@tonaljs/core");

var _note = require("@tonaljs/note");

var _romanNumeral = require("@tonaljs/roman-numeral");

const Empty = Object.freeze([]);
const NoKey = {
  type: "major",
  tonic: "",
  alteration: 0,
  keySignature: ""
};
const NoKeyScale = {
  tonic: "",
  grades: Empty,
  intervals: Empty,
  scale: Empty,
  chords: Empty,
  chordsHarmonicFunction: Empty,
  chordScales: Empty
};
const NoMajorKey = { ...NoKey,
  ...NoKeyScale,
  type: "major",
  minorRelative: "",
  scale: Empty,
  secondaryDominants: Empty,
  secondaryDominantsMinorRelative: Empty,
  substituteDominants: Empty,
  substituteDominantsMinorRelative: Empty
};
const NoMinorKey = { ...NoKey,
  type: "minor",
  relativeMajor: "",
  natural: NoKeyScale,
  harmonic: NoKeyScale,
  melodic: NoKeyScale
};

const mapScaleToType = (scale, list, sep = "") => list.map((type, i) => `${scale[i]}${sep}${type}`);

function keyScale(grades, chords, harmonicFunctions, chordScales) {
  return tonic => {
    const intervals = grades.map(gr => (0, _romanNumeral.get)(gr).interval || "");
    const scale = intervals.map(interval => (0, _core.transpose)(tonic, interval));
    return {
      tonic,
      grades,
      intervals,
      scale,
      chords: mapScaleToType(scale, chords),
      chordsHarmonicFunction: harmonicFunctions.slice(),
      chordScales: mapScaleToType(scale, chordScales, " ")
    };
  };
}

const distInFifths = (from, to) => {
  const f = (0, _core.note)(from);
  const t = (0, _core.note)(to);
  return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
};

const MajorScale = keyScale("I II III IV V VI VII".split(" "), "maj7 m7 m7 maj7 7 m7 m7b5".split(" "), "T SD T SD D T D".split(" "), "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(","));
const NaturalScale = keyScale("I II bIII IV V bVI bVII".split(" "), "m7 m7b5 maj7 m7 m7 maj7 7".split(" "), "T SD T SD D SD SD".split(" "), "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(","));
const HarmonicScale = keyScale("I II bIII IV V bVI VII".split(" "), "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "), "T SD T SD D SD D".split(" "), "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(","));
const MelodicScale = keyScale("I II bIII IV V VI VII".split(" "), "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "), "T SD T SD D  ".split(" "), "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(","));
/**
 * Get a major key properties in a given tonic
 * @param tonic
 */

function majorKey(tonic) {
  const pc = (0, _core.note)(tonic).pc;
  if (!pc) return NoMajorKey;
  const keyScale = MajorScale(pc);
  const alteration = distInFifths("C", pc);

  const romanInTonic = src => {
    const r = (0, _romanNumeral.get)(src);
    if (r.empty) return "";
    return (0, _core.transpose)(tonic, r.interval) + r.chordType;
  };

  return { ...keyScale,
    type: "major",
    minorRelative: (0, _core.transpose)(pc, "-3m"),
    alteration,
    keySignature: (0, _core.altToAcc)(alteration),
    secondaryDominants: "- VI7 VII7 I7 II7 III7 -".split(" ").map(romanInTonic),
    secondaryDominantsMinorRelative: "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -".split(" ").map(romanInTonic),
    substituteDominants: "- bIII7 IV7 bV7 bVI7 bVII7 -".split(" ").map(romanInTonic),
    substituteDominantsMinorRelative: "- IIIm7 Im7 IIbm7 VIm7 IVm7 -".split(" ").map(romanInTonic)
  };
}
/**
 * Get minor key properties in a given tonic
 * @param tonic
 */


function minorKey(tnc) {
  const pc = (0, _core.note)(tnc).pc;
  if (!pc) return NoMinorKey;
  const alteration = distInFifths("C", pc) - 3;
  return {
    type: "minor",
    tonic: pc,
    relativeMajor: (0, _core.transpose)(pc, "3m"),
    alteration,
    keySignature: (0, _core.altToAcc)(alteration),
    natural: NaturalScale(pc),
    harmonic: HarmonicScale(pc),
    melodic: MelodicScale(pc)
  };
}
/**
 * Given a key signature, returns the tonic of the major key
 * @param sigature
 * @example
 * majorTonicFromKeySignature('###') // => 'A'
 */


function majorTonicFromKeySignature(sig) {
  if (typeof sig === "number") {
    return (0, _note.transposeFifths)("C", sig);
  } else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
    return (0, _note.transposeFifths)("C", (0, _core.accToAlt)(sig));
  }

  return null;
}

var index = {
  majorKey,
  majorTonicFromKeySignature,
  minorKey
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/note":"node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/roman-numeral":"node_modules/@tonaljs/roman-numeral/dist/index.es.js"}],"node_modules/@tonaljs/mode/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = all;
exports.distance = distance;
exports.get = get;
exports.names = names;
exports.notes = notes;
exports.relativeTonic = relativeTonic;
exports.triads = exports.seventhChords = exports.mode = exports.entries = exports.default = void 0;

var _collection = require("@tonaljs/collection");

var _core = require("@tonaljs/core");

var _interval = require("@tonaljs/interval");

var _pcset = require("@tonaljs/pcset");

const MODES = [[0, 2773, 0, "ionian", "", "Maj7", "major"], [1, 2902, 2, "dorian", "m", "m7"], [2, 3418, 4, "phrygian", "m", "m7"], [3, 2741, -1, "lydian", "", "Maj7"], [4, 2774, 1, "mixolydian", "", "7"], [5, 2906, 3, "aeolian", "m", "m7", "minor"], [6, 3434, 5, "locrian", "dim", "m7b5"]];
const NoMode = { ..._pcset.EmptyPcset,
  name: "",
  alt: 0,
  modeNum: NaN,
  triad: "",
  seventh: "",
  aliases: []
};
const modes = MODES.map(toMode);
const index = {};
modes.forEach(mode => {
  index[mode.name] = mode;
  mode.aliases.forEach(alias => {
    index[alias] = mode;
  });
});
/**
 * Get a Mode by it's name
 *
 * @example
 * get('dorian')
 * // =>
 * // {
 * //   intervals: [ '1P', '2M', '3m', '4P', '5P', '6M', '7m' ],
 * //   modeNum: 1,
 * //   chroma: '101101010110',
 * //   normalized: '101101010110',
 * //   name: 'dorian',
 * //   setNum: 2902,
 * //   alt: 2,
 * //   triad: 'm',
 * //   seventh: 'm7',
 * //   aliases: []
 * // }
 */

function get(name) {
  return typeof name === "string" ? index[name.toLowerCase()] || NoMode : name && name.name ? get(name.name) : NoMode;
}

const mode = (0, _core.deprecate)("Mode.mode", "Mode.get", get);
/**
 * Get a list of all modes
 */

exports.mode = mode;

function all() {
  return modes.slice();
}

const entries = (0, _core.deprecate)("Mode.mode", "Mode.all", all);
/**
 * Get a list of all mode names
 */

exports.entries = entries;

function names() {
  return modes.map(mode => mode.name);
}

function toMode(mode) {
  const [modeNum, setNum, alt, name, triad, seventh, alias] = mode;
  const aliases = alias ? [alias] : [];
  const chroma = Number(setNum).toString(2);
  const intervals = (0, _pcset.chromaToIntervals)(chroma);
  return {
    empty: false,
    intervals,
    modeNum,
    chroma,
    normalized: chroma,
    name,
    setNum,
    alt,
    triad,
    seventh,
    aliases
  };
}

function notes(modeName, tonic) {
  return get(modeName).intervals.map(ivl => (0, _core.transpose)(tonic, ivl));
}

function chords(chords) {
  return (modeName, tonic) => {
    const mode = get(modeName);
    if (mode.empty) return [];
    const triads = (0, _collection.rotate)(mode.modeNum, chords);
    const tonics = mode.intervals.map(i => (0, _core.transpose)(tonic, i));
    return triads.map((triad, i) => tonics[i] + triad);
  };
}

const triads = chords(MODES.map(x => x[4]));
exports.triads = triads;
const seventhChords = chords(MODES.map(x => x[5]));
exports.seventhChords = seventhChords;

function distance(destination, source) {
  const from = get(source);
  const to = get(destination);
  if (from.empty || to.empty) return "";
  return (0, _interval.simplify)((0, _interval.transposeFifths)("1P", to.alt - from.alt));
}

function relativeTonic(destination, source, tonic) {
  return (0, _core.transpose)(tonic, distance(destination, source));
}

var index$1 = {
  get,
  names,
  all,
  distance,
  relativeTonic,
  notes,
  triads,
  seventhChords,
  // deprecated
  entries,
  mode
};
var _default = index$1;
exports.default = _default;
},{"@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/interval":"node_modules/@tonaljs/interval/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js"}],"node_modules/@tonaljs/progression/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromRomanNumerals = fromRomanNumerals;
exports.toRomanNumerals = toRomanNumerals;
exports.default = void 0;

var _chord = require("@tonaljs/chord");

var _core = require("@tonaljs/core");

var _romanNumeral = require("@tonaljs/roman-numeral");

/**
 * Given a tonic and a chord list expressed with roman numeral notation
 * returns the progression expressed with leadsheet chords symbols notation
 * @example
 * fromRomanNumerals("C", ["I", "IIm7", "V7"]);
 * // => ["C", "Dm7", "G7"]
 */
function fromRomanNumerals(tonic, chords) {
  const romanNumerals = chords.map(_romanNumeral.get);
  return romanNumerals.map(rn => (0, _core.transpose)(tonic, (0, _core.interval)(rn)) + rn.chordType);
}
/**
 * Given a tonic and a chord list with leadsheet symbols notation,
 * return the chord list with roman numeral notation
 * @example
 * toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
 * // => ["IMaj7", "IIm7", "V7"]
 */


function toRomanNumerals(tonic, chords) {
  return chords.map(chord => {
    const [note, chordType] = (0, _chord.tokenize)(chord);
    const intervalName = (0, _core.distance)(tonic, note);
    const roman = (0, _romanNumeral.get)((0, _core.interval)(intervalName));
    return roman.name + chordType;
  });
}

var index = {
  fromRomanNumerals,
  toRomanNumerals
};
var _default = index;
exports.default = _default;
},{"@tonaljs/chord":"node_modules/@tonaljs/chord/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/roman-numeral":"node_modules/@tonaljs/roman-numeral/dist/index.es.js"}],"node_modules/@tonaljs/range/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chromatic = chromatic;
exports.numeric = numeric;
exports.default = void 0;

var _collection = require("@tonaljs/collection");

var _midi = require("@tonaljs/midi");

/**
 * Create a numeric range. You supply a list of notes or numbers and it will
 * be connected to create complex ranges.
 *
 * @param {Array} notes - the list of notes or midi numbers used
 * @return {Array} an array of numbers or empty array if not valid parameters
 *
 * @example
 * numeric(["C5", "C4"]) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
 * // it works midi notes
 * numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
 * // complex range
 * numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 */
function numeric(notes) {
  const midi = (0, _collection.compact)(notes.map(_midi.toMidi));

  if (!notes.length || midi.length !== notes.length) {
    // there is no valid notes
    return [];
  }

  return midi.reduce((result, note) => {
    const last = result[result.length - 1];
    return result.concat((0, _collection.range)(last, note).slice(1));
  }, [midi[0]]);
}
/**
 * Create a range of chromatic notes. The altered notes will use flats.
 *
 * @function
 * @param {Array} notes - the list of notes or midi note numbers to create a range from
 * @param {Object} options - The same as `midiToNoteName` (`{ sharps: boolean, pitchClass: boolean }`)
 * @return {Array} an array of note names
 *
 * @example
 * Range.chromatic(["C2, "E2", "D2"]) // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
 * // with sharps
 * Range.chromatic(["C2", "C3"], { sharps: true }) // => [ "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3" ]
 */


function chromatic(notes, options) {
  return numeric(notes).map(midi => (0, _midi.midiToNoteName)(midi, options));
}

var index = {
  numeric,
  chromatic
};
var _default = index;
exports.default = _default;
},{"@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/midi":"node_modules/@tonaljs/midi/dist/index.es.js"}],"node_modules/@tonaljs/scale/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extended = extended;
exports.get = get;
exports.modeNames = modeNames;
exports.rangeOf = rangeOf;
exports.reduced = reduced;
exports.scaleChords = scaleChords;
exports.scaleNotes = scaleNotes;
exports.tokenize = tokenize;
exports.scale = exports.names = exports.default = void 0;

var _chordType = require("@tonaljs/chord-type");

var _collection = require("@tonaljs/collection");

var _core = require("@tonaljs/core");

var _note = require("@tonaljs/note");

var _pcset = require("@tonaljs/pcset");

var _scaleType = require("@tonaljs/scale-type");

/**
 * References:
 * - https://www.researchgate.net/publication/327567188_An_Algorithm_for_Spelling_the_Pitches_of_Any_Musical_Scale
 * @module scale
 */
const NoScale = {
  empty: true,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
/**
 * Given a string with a scale name and (optionally) a tonic, split
 * that components.
 *
 * It retuns an array with the form [ name, tonic ] where tonic can be a
 * note name or null and name can be any arbitrary string
 * (this function doesn"t check if that scale name exists)
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * tokenize("C mixolydean") // => ["C", "mixolydean"]
 * tokenize("anything is valid") // => ["", "anything is valid"]
 * tokenize() // => ["", ""]
 */

function tokenize(name) {
  if (typeof name !== "string") {
    return ["", ""];
  }

  const i = name.indexOf(" ");
  const tonic = (0, _core.note)(name.substring(0, i));

  if (tonic.empty) {
    const n = (0, _core.note)(name);
    return n.empty ? ["", name] : [n.name, ""];
  }

  const type = name.substring(tonic.name.length + 1);
  return [tonic.name, type.length ? type : ""];
}
/**
 * Get all scale names
 * @function
 */


const names = _scaleType.names;
/**
 * Get a Scale from a scale name.
 */

exports.names = names;

function get(src) {
  const tokens = Array.isArray(src) ? src : tokenize(src);
  const tonic = (0, _core.note)(tokens[0]).name;
  const st = (0, _scaleType.get)(tokens[1]);

  if (st.empty) {
    return NoScale;
  }

  const type = st.name;
  const notes = tonic ? st.intervals.map(i => (0, _core.transpose)(tonic, i)) : [];
  const name = tonic ? tonic + " " + type : type;
  return { ...st,
    name,
    type,
    tonic,
    notes
  };
}

const scale = (0, _core.deprecate)("Scale.scale", "Scale.get", get);
/**
 * Get all chords that fits a given scale
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array<string>} - the chord names
 *
 * @example
 * scaleChords("pentatonic") // => ["5", "64", "M", "M6", "Madd9", "Msus2"]
 */

exports.scale = scale;

function scaleChords(name) {
  const s = get(name);
  const inScale = (0, _pcset.isSubsetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => inScale(chord.chroma)).map(chord => chord.aliases[0]);
}
/**
 * Get all scales names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 * @example
 * extended("major") // => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
 */


function extended(name) {
  const s = get(name);
  const isSuperset = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _scaleType.all)().filter(scale => isSuperset(scale.chroma)).map(scale => scale.name);
}
/**
 * Find all scales names that are a subset of the given one
 * (has less notes but all from the given scale)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 *
 * @example
 * reduced("major") // => ["ionian pentatonic", "major pentatonic", "ritusen"]
 */


function reduced(name) {
  const isSubset = (0, _pcset.isSubsetOf)(get(name).chroma);
  return (0, _scaleType.all)().filter(scale => isSubset(scale.chroma)).map(scale => scale.name);
}
/**
 * Given an array of notes, return the scale: a pitch class set starting from
 * the first note of the array
 *
 * @function
 * @param {string[]} notes
 * @return {string[]} pitch classes with same tonic
 * @example
 * scaleNotes(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
 * scaleNotes(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
 */


function scaleNotes(notes) {
  const pcset = notes.map(n => (0, _core.note)(n).pc).filter(x => x);
  const tonic = pcset[0];
  const scale = (0, _note.sortedUniqNames)(pcset);
  return (0, _collection.rotate)(scale.indexOf(tonic), scale);
}
/**
 * Find mode names of a scale
 *
 * @function
 * @param {string} name - scale name
 * @example
 * modeNames("C pentatonic") // => [
 *   ["C", "major pentatonic"],
 *   ["D", "egyptian"],
 *   ["E", "malkos raga"],
 *   ["G", "ritusen"],
 *   ["A", "minor pentatonic"]
 * ]
 */


function modeNames(name) {
  const s = get(name);

  if (s.empty) {
    return [];
  }

  const tonics = s.tonic ? s.notes : s.intervals;
  return (0, _pcset.modes)(s.chroma).map((chroma, i) => {
    const modeName = get(chroma).name;
    return modeName ? [tonics[i], modeName] : ["", ""];
  }).filter(x => x[0]);
}

function getNoteNameOf(scale) {
  const names = Array.isArray(scale) ? scaleNotes(scale) : get(scale).notes;
  const chromas = names.map(name => (0, _core.note)(name).chroma);
  return noteOrMidi => {
    const height = typeof noteOrMidi === "number" ? noteOrMidi : (0, _core.note)(noteOrMidi).height;
    if (height === undefined) return undefined;
    const chroma = height % 12;
    const oct = Math.floor(height / 12) - 1;
    const position = chromas.indexOf(chroma);
    if (position === -1) return undefined;
    return names[position] + oct;
  };
}

function rangeOf(scale) {
  const getName = getNoteNameOf(scale);
  return (fromNote, toNote) => {
    const from = (0, _core.note)(fromNote).height;
    const to = (0, _core.note)(toNote).height;
    if (from === undefined || to === undefined) return [];
    return (0, _collection.range)(from, to).map(getName).filter(x => x);
  };
}

var index = {
  get,
  names,
  extended,
  modeNames,
  reduced,
  scaleChords,
  scaleNotes,
  tokenize,
  rangeOf,
  // deprecated
  scale
};
var _default = index;
exports.default = _default;
},{"@tonaljs/chord-type":"node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/note":"node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/scale-type":"node_modules/@tonaljs/scale-type/dist/index.es.js"}],"node_modules/@tonaljs/time-signature/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.parse = parse;
exports.default = void 0;
// CONSTANTS
const NONE = {
  empty: true,
  name: "",
  upper: undefined,
  lower: undefined,
  type: undefined,
  additive: []
};
const NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"]; // PUBLIC API

function names() {
  return NAMES.slice();
}

const REGEX = /^(\d?\d(?:\+\d)*)\/(\d)$/;
const CACHE = new Map();

function get(literal) {
  const cached = CACHE.get(literal);

  if (cached) {
    return cached;
  }

  const ts = build(parse(literal));
  CACHE.set(literal, ts);
  return ts;
}

function parse(literal) {
  if (typeof literal === "string") {
    const [_, up, low] = REGEX.exec(literal) || [];
    return parse([up, low]);
  }

  const [up, down] = literal;
  const denominator = +down;

  if (typeof up === "number") {
    return [up, denominator];
  }

  const list = up.split("+").map(n => +n);
  return list.length === 1 ? [list[0], denominator] : [list, denominator];
}

var index = {
  names,
  parse,
  get
}; // PRIVATE

function build([up, down]) {
  const upper = Array.isArray(up) ? up.reduce((a, b) => a + b, 0) : up;
  const lower = down;

  if (upper === 0 || lower === 0) {
    return NONE;
  }

  const name = Array.isArray(up) ? `${up.join("+")}/${down}` : `${up}/${down}`;
  const additive = Array.isArray(up) ? up : [];
  const type = lower === 4 || lower === 2 ? "simple" : lower === 8 && upper % 3 === 0 ? "compound" : "irregular";
  return {
    empty: false,
    name,
    type,
    upper,
    lower,
    additive
  };
}

var _default = index;
exports.default = _default;
},{}],"node_modules/@tonaljs/tonal/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ChordDictionary: true,
  PcSet: true,
  ScaleDictionary: true,
  Tonal: true,
  AbcNotation: true,
  Array: true,
  Chord: true,
  ChordType: true,
  Collection: true,
  Core: true,
  DurationValue: true,
  Interval: true,
  Key: true,
  Midi: true,
  Mode: true,
  Note: true,
  Pcset: true,
  Progression: true,
  Range: true,
  RomanNumeral: true,
  Scale: true,
  ScaleType: true,
  TimeSignature: true
};
Object.defineProperty(exports, "AbcNotation", {
  enumerable: true,
  get: function () {
    return _abcNotation.default;
  }
});
Object.defineProperty(exports, "Chord", {
  enumerable: true,
  get: function () {
    return _chord.default;
  }
});
Object.defineProperty(exports, "ChordType", {
  enumerable: true,
  get: function () {
    return _chordType.default;
  }
});
Object.defineProperty(exports, "Collection", {
  enumerable: true,
  get: function () {
    return _collection.default;
  }
});
Object.defineProperty(exports, "DurationValue", {
  enumerable: true,
  get: function () {
    return _durationValue.default;
  }
});
Object.defineProperty(exports, "Interval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});
Object.defineProperty(exports, "Key", {
  enumerable: true,
  get: function () {
    return _key.default;
  }
});
Object.defineProperty(exports, "Midi", {
  enumerable: true,
  get: function () {
    return _midi.default;
  }
});
Object.defineProperty(exports, "Mode", {
  enumerable: true,
  get: function () {
    return _mode.default;
  }
});
Object.defineProperty(exports, "Note", {
  enumerable: true,
  get: function () {
    return _note.default;
  }
});
Object.defineProperty(exports, "Pcset", {
  enumerable: true,
  get: function () {
    return _pcset.default;
  }
});
Object.defineProperty(exports, "Progression", {
  enumerable: true,
  get: function () {
    return _progression.default;
  }
});
Object.defineProperty(exports, "Range", {
  enumerable: true,
  get: function () {
    return _range.default;
  }
});
Object.defineProperty(exports, "RomanNumeral", {
  enumerable: true,
  get: function () {
    return _romanNumeral.default;
  }
});
Object.defineProperty(exports, "Scale", {
  enumerable: true,
  get: function () {
    return _scale.default;
  }
});
Object.defineProperty(exports, "ScaleType", {
  enumerable: true,
  get: function () {
    return _scaleType.default;
  }
});
Object.defineProperty(exports, "TimeSignature", {
  enumerable: true,
  get: function () {
    return _timeSignature.default;
  }
});
exports.Core = exports.Array = exports.Tonal = exports.ScaleDictionary = exports.PcSet = exports.ChordDictionary = void 0;

var _abcNotation = _interopRequireDefault(require("@tonaljs/abc-notation"));

var array = _interopRequireWildcard(require("@tonaljs/array"));

exports.Array = array;

var _chord = _interopRequireDefault(require("@tonaljs/chord"));

var _chordType = _interopRequireDefault(require("@tonaljs/chord-type"));

var _collection = _interopRequireDefault(require("@tonaljs/collection"));

var Core = _interopRequireWildcard(require("@tonaljs/core"));

exports.Core = Core;
Object.keys(Core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === Core[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return Core[key];
    }
  });
});

var _durationValue = _interopRequireDefault(require("@tonaljs/duration-value"));

var _interval = _interopRequireDefault(require("@tonaljs/interval"));

var _key = _interopRequireDefault(require("@tonaljs/key"));

var _midi = _interopRequireDefault(require("@tonaljs/midi"));

var _mode = _interopRequireDefault(require("@tonaljs/mode"));

var _note = _interopRequireDefault(require("@tonaljs/note"));

var _pcset = _interopRequireDefault(require("@tonaljs/pcset"));

var _progression = _interopRequireDefault(require("@tonaljs/progression"));

var _range = _interopRequireDefault(require("@tonaljs/range"));

var _romanNumeral = _interopRequireDefault(require("@tonaljs/roman-numeral"));

var _scale = _interopRequireDefault(require("@tonaljs/scale"));

var _scaleType = _interopRequireDefault(require("@tonaljs/scale-type"));

var _timeSignature = _interopRequireDefault(require("@tonaljs/time-signature"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// deprecated (backwards compatibility)
const Tonal = Core;
exports.Tonal = Tonal;
const PcSet = _pcset.default;
exports.PcSet = PcSet;
const ChordDictionary = _chordType.default;
exports.ChordDictionary = ChordDictionary;
const ScaleDictionary = _scaleType.default;
exports.ScaleDictionary = ScaleDictionary;
},{"@tonaljs/abc-notation":"node_modules/@tonaljs/abc-notation/dist/index.es.js","@tonaljs/array":"node_modules/@tonaljs/array/dist/index.es.js","@tonaljs/chord":"node_modules/@tonaljs/chord/dist/index.es.js","@tonaljs/chord-type":"node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/duration-value":"node_modules/@tonaljs/duration-value/dist/index.es.js","@tonaljs/interval":"node_modules/@tonaljs/interval/dist/index.es.js","@tonaljs/key":"node_modules/@tonaljs/key/dist/index.es.js","@tonaljs/midi":"node_modules/@tonaljs/midi/dist/index.es.js","@tonaljs/mode":"node_modules/@tonaljs/mode/dist/index.es.js","@tonaljs/note":"node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/progression":"node_modules/@tonaljs/progression/dist/index.es.js","@tonaljs/range":"node_modules/@tonaljs/range/dist/index.es.js","@tonaljs/roman-numeral":"node_modules/@tonaljs/roman-numeral/dist/index.es.js","@tonaljs/scale":"node_modules/@tonaljs/scale/dist/index.es.js","@tonaljs/scale-type":"node_modules/@tonaljs/scale-type/dist/index.es.js","@tonaljs/time-signature":"node_modules/@tonaljs/time-signature/dist/index.es.js"}],"node_modules/lodash/isObject.js":[function(require,module,exports) {
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],"node_modules/lodash/_freeGlobal.js":[function(require,module,exports) {
var global = arguments[3];
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

},{}],"node_modules/lodash/_root.js":[function(require,module,exports) {
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":"node_modules/lodash/_freeGlobal.js"}],"node_modules/lodash/now.js":[function(require,module,exports) {
var root = require('./_root');

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_Symbol.js":[function(require,module,exports) {
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_getRawTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":"node_modules/lodash/_Symbol.js"}],"node_modules/lodash/_objectToString.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],"node_modules/lodash/_baseGetTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":"node_modules/lodash/_Symbol.js","./_getRawTag":"node_modules/lodash/_getRawTag.js","./_objectToString":"node_modules/lodash/_objectToString.js"}],"node_modules/lodash/isObjectLike.js":[function(require,module,exports) {
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],"node_modules/lodash/isSymbol.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/toNumber.js":[function(require,module,exports) {
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":"node_modules/lodash/isObject.js","./isSymbol":"node_modules/lodash/isSymbol.js"}],"node_modules/lodash/debounce.js":[function(require,module,exports) {
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":"node_modules/lodash/isObject.js","./now":"node_modules/lodash/now.js","./toNumber":"node_modules/lodash/toNumber.js"}],"js/MIDIInput.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tonal = require("@tonaljs/tonal");

var _chordDetect = require("@tonaljs/chord-detect");

var _debounce = _interopRequireDefault(require("lodash/debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MIDIInput {
  constructor() {
    let {
      onChange = () => {},
      onError = () => {},
      onNoteOn = () => {},
      onNoteOff = () => {}
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.notes = new Set();

    const onNoteChange = () => {
      onChange({
        notes: this.noteNames,
        chords: this.chords
      });
    };

    this.onNoteChange = (0, _debounce.default)(onNoteChange.bind(this), 100);
    this.onError = onError;
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;
    this.init();
  }

  async init() {
    if (navigator.requestMIDIAccess) {
      const midiAccess = await navigator.requestMIDIAccess();
      const inputs = midiAccess.inputs;

      for (const input of inputs.values()) {
        input.onmidimessage = this.onMIDIMessage.bind(this);
        console.log('All set up!');
      }
    } else {
      this.onError('WebMIDI is not supported in this browser');
      console.log('WebMIDI is not supported in this browser.');
    }
  }

  get noteNames() {
    return Array.from(this.notes.values()).sort().map(note => _tonal.Midi.midiToNoteName(note, {
      pitchClass: true,
      sharps: true
    }));
  }

  get chords() {
    return (0, _chordDetect.detect)(this.noteNames);
  }

  onMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
      case 144:
        // noteOn
        if (velocity > 0) {
          this.notes.add(note);
          this.onNoteOn(note);
        } else {
          this.notes.delete(note);
          this.onNoteOff(note);
        }

        this.onNoteChange();
        break;

      case 128:
        // noteOff
        this.notes.delete(note);
        this.onNoteOff(note);
        this.onNoteChange();
        break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
  }

}

exports.default = MIDIInput;
},{"@tonaljs/tonal":"node_modules/@tonaljs/tonal/dist/index.es.js","@tonaljs/chord-detect":"node_modules/@tonaljs/chord-detect/dist/index.es.js","lodash/debounce":"node_modules/lodash/debounce.js"}],"js/Piano.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tonal = require("@tonaljs/tonal");

class Piano {
  constructor() {
    this.piano = document.querySelector('.piano');
  }

  noteOn(note) {
    const noteName = _tonal.Midi.midiToNoteName(note, {
      pitchClass: true,
      sharps: true
    });

    this.piano.querySelector("[data-note=\"".concat(noteName, "\"]")).classList.add('pressed');
  }

  noteOff(note) {
    console.log('noteOff', note);

    const noteName = _tonal.Midi.midiToNoteName(note, {
      pitchClass: true,
      sharps: true
    });

    this.piano.querySelector("[data-note=\"".concat(noteName, "\"]")).classList.remove('pressed');
  }

}

exports.default = Piano;
},{"@tonaljs/tonal":"node_modules/@tonaljs/tonal/dist/index.es.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

var _MIDIInput = _interopRequireDefault(require("./MIDIInput"));

var _Piano = _interopRequireDefault(require("./Piano"));

var _tonal = require("@tonaljs/tonal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

class Game {
  constructor() {
    this.piano = new _Piano.default();
    this.input = new _MIDIInput.default({
      onChange: this.onChange.bind(this),
      onNoteOn: this.piano.noteOn.bind(this.piano),
      onNoteOff: this.piano.noteOff.bind(this.piano)
    });
    this.els = {
      currentChord: document.querySelector('.currentChord'),
      targets: document.querySelector('.targets')
    };
    this.targets = new Map();
    this.addTarget();
    this.addTarget();
  }

  addTarget() {
    const {
      root,
      quality
    } = this.getChordTarget();
    const target = root + quality;
    const existing = this.targets.get(target);

    if (existing) {
      console.log("".concat(target, " already exists!"));
      return;
    }

    const targetEl = document.createElement('div');

    if (quality === 'M') {
      targetEl.innerHTML = "<div class=\"target__root\">".concat(root, "</div>");
    } else {
      targetEl.innerHTML = "<div class=\"target__root\">".concat(root, "</div><div class=\"target__quality\">").concat(quality, "</div>");
    }

    targetEl.classList.add('target');
    this.targets.set(target, targetEl);
    this.els.targets.appendChild(targetEl);
  }

  removeTarget(chord) {
    const target = this.targets.get(chord);

    if (target) {
      target.parentElement.removeChild(target);
      this.targets.delete(target);
    }
  }

  getChordTarget() {
    let {
      length = 3,
      qualities = ['Major', 'Minor']
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];

    const validChordTypes = _tonal.ChordType.all().filter(c => c.intervals.length === length && qualities.includes(c.quality)).map(c => c.aliases[0]);

    console.log({
      validChordTypes
    });
    const randomType = validChordTypes[Math.floor(Math.random() * validChordTypes.length)];
    return {
      root: randomNote,
      quality: randomType
    };
  }

  async onChange(_ref) {
    let {
      notes,
      chords
    } = _ref;
    console.log({
      notes,
      chords
    });
    this.els.currentChord.textContent = chords[0];
    this.removeTarget(chords[0]);
  }

}

new Game();
},{"./MIDIInput":"js/MIDIInput.js","./Piano":"js/Piano.js","@tonaljs/tonal":"node_modules/@tonaljs/tonal/dist/index.es.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59847" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map