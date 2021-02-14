import { Midi } from '@tonaljs/tonal';
import { detect } from '@tonaljs/chord-detect';
import debounce from 'lodash/debounce';

export default class MIDIInput {
	constructor({
		onChange = () => {},
		onError = () => {},
		onNoteOn = () => {},
		onNoteOff = () => {},
	} = {}) {
		this.notes = new Set();
		const onNoteChange = () => {
			onChange({ notes: this.noteNames, chords: this.chords });
		};
		this.onNoteChange = debounce(onNoteChange.bind(this), 100);
		this.onError = onError;
		this.onNoteOn = onNoteOn;
		this.onNoteOff = onNoteOff;
		this.init();
	}

	async init() {
		if (navigator.requestMIDIAccess) {
			try {
				const midiAccess = await navigator.requestMIDIAccess();
				const inputs = midiAccess.inputs;

				if (!inputs || !inputs.size) {
					this.onError('This game requires a MIDI device to play');
				}

				for (const input of inputs.values()) {
					input.onmidimessage = this.onMIDIMessage.bind(this);
				}
			} catch (err) {
				this.onError(err.message);
			}
		} else {
			this.onError('WebMIDI is not supported in this browser');
		}
	}

	get noteNames() {
		return Array.from(this.notes.values())
			.sort()
			.map((note) =>
				Midi.midiToNoteName(note, { pitchClass: true, sharps: true })
			);
	}

	get chords() {
		return detect(this.noteNames);
	}

	onMIDIMessage(message) {
		var command = message.data[0];
		var note = message.data[1];
		var velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

		// Mask off the lower nibble (MIDI channel, which we don't care about)
		switch (command & 0xf0) {
			case 144: // noteOn
				if (velocity > 0) {
					this.notes.add(note);
					this.onNoteOn(note);
				} else {
					this.notes.delete(note);
					this.onNoteOff(note);
				}
				this.onNoteChange();
				break;
			case 128: // noteOff
				this.notes.delete(note);
				this.onNoteOff(note);
				this.onNoteChange();
				break;
			// we could easily expand this switch statement to cover other types of commands such as controllers or sysex
		}
	}
}
