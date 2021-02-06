import MIDIInput from './MIDIInput';
import Piano from './Piano';
import { Note, Key, ChordType } from '@tonaljs/tonal';

const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

class Game {
	constructor() {
		this.piano = new Piano();
		this.input = new MIDIInput({
			onChange: this.onChange.bind(this),
			onNoteOn: this.piano.noteOn.bind(this.piano),
			onNoteOff: this.piano.noteOff.bind(this.piano),
		});
		this.els = {
			currentChord: document.querySelector('.currentChord'),
			targets: document.querySelector('.targets'),
		};
		this.targets = new Map();
		this.addTarget();
		this.addTarget();
	}

	addTarget() {
		const { root, quality } = this.getChordTarget();
		const target = root + quality;
		const existing = this.targets.get(target);
		if (existing) {
			console.log(`${target} already exists!`);
			return;
		}
		const targetEl = document.createElement('div');
		if (quality === 'M') {
			targetEl.innerHTML = `<div class="target__root">${root}</div>`;
		} else {
			targetEl.innerHTML = `<div class="target__root">${root}</div><div class="target__quality">${quality}</div>`;
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

	getChordTarget({ length = 3, qualities = ['Major', 'Minor'] } = {}) {
		const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
		const validChordTypes = ChordType.all()
			.filter(
				(c) => c.intervals.length === length && qualities.includes(c.quality)
			)
			.map((c) => c.aliases[0]);
		console.log({ validChordTypes });
		const randomType =
			validChordTypes[Math.floor(Math.random() * validChordTypes.length)];
		return {
			root: randomNote,
			quality: randomType,
		};
	}

	async onChange({ notes, chords }) {
		console.log({ notes, chords });
		this.els.currentChord.textContent = chords[0];
		this.removeTarget(chords[0]);
	}
}

new Game();
