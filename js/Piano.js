import { Midi } from '@tonaljs/tonal';
import * as Tone from 'tone';

export default class Piano {
	constructor() {
		this.display = document.querySelector('.piano');
	}

	start() {
		const reverb = new Tone.Reverb().toDestination();
		const filter = new Tone.Filter(500, 'highpass').toDestination();
		this.synth = new Tone.PolySynth().connect(filter).connect(reverb);
		Tone.start();
	}

	noteOn(note) {
		const noteName = Midi.midiToNoteName(note, {
			sharps: true,
		});
		const noteClass = Midi.midiToNoteName(note, {
			pitchClass: true,
			sharps: true,
		});
		this.synth.triggerAttack(noteName, Tone.now());
		this.display
			.querySelector(`[data-note="${noteClass}"]`)
			.classList.add('pressed');
	}

	noteOff(note) {
		const noteName = Midi.midiToNoteName(note, {
			sharps: true,
		});
		const noteClass = Midi.midiToNoteName(note, {
			pitchClass: true,
			sharps: true,
		});
		this.synth.triggerRelease(noteName, Tone.now());
		this.display
			.querySelector(`[data-note="${noteClass}"]`)
			.classList.remove('pressed');
	}
}
