import { Midi } from '@tonaljs/tonal';

export default class Piano {
	constructor() {
		this.piano = document.querySelector('.piano');
	}

	noteOn(note) {
		const noteName = Midi.midiToNoteName(note, {
			pitchClass: true,
			sharps: true,
		});
		this.piano
			.querySelector(`[data-note="${noteName}"]`)
			.classList.add('pressed');
	}

	noteOff(note) {
		console.log('noteOff', note);
		const noteName = Midi.midiToNoteName(note, {
			pitchClass: true,
			sharps: true,
		});
		this.piano
			.querySelector(`[data-note="${noteName}"]`)
			.classList.remove('pressed');
	}
}
