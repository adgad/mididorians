import MIDIInput from './MIDIInput';
import Piano from './Piano';
import Target from './Target';
import { Note, Key, ChordType } from '@tonaljs/tonal';

class Game {
	constructor() {
		this.piano = new Piano();
		this.input = new MIDIInput({
			onChange: this.onChange.bind(this),
			onNoteOn: this.piano.noteOn.bind(this.piano),
			onNoteOff: this.piano.noteOff.bind(this.piano),
			onError: this.onError.bind(this),
		});
		this.els = {
			currentChord: document.querySelector('.currentChord'),
			targets: document.querySelector('.targets'),
			startButton: document.querySelector('.start-game'),
			score: document.querySelector('.score'),
			error: document.querySelector('.error'),
		};

		this.els.startButton.addEventListener('click', this.start.bind(this));
		this.gameLoop = null;
	}

	start() {
		document.body.classList.add('started');
		this.settings = {
			chordLength: document.querySelector('#chord-length').value,
			chordComplexity: document.querySelector('#chord-complexity').value,
			speed: document.querySelector('#chord-pace').value,
			chordRoots: [
				...document.querySelector('#chord-roots').selectedOptions,
			].map((o) => o.value),
		};
		this.resetScore();
		this.piano.start();
		this.createTarget();
		this.gameLoop = setInterval(() => {
			this.createTarget();
		}, this.settings.speed / 2);
	}

	async createTarget() {
		try {
			const target = Target.create(this.settings);
			await target.invaded;
			this.gameOver();
		} catch (err) {}
	}

	gameOver() {
		document.body.classList.remove('started');
		Target.clear();
		this.els.error.textContent = 'Game Over! You s-chord ' + this.score;
		this.resetScore();
		clearInterval(this.gameLoop);
	}

	incrementScore() {
		this.score++;
		this.els.score.textContent = this.score;
	}

	resetScore() {
		this.score = 0;
		this.els.score.textContent = this.score;
	}

	onError(error) {
		this.els.startButton.setAttribute('disabled', 'disabled');
		this.els.error.textContent = error;
	}

	async onChange({ notes, chords }) {
		this.els.currentChord.textContent = (chords[0] || '').replace(
			/(.*)M$/,
			'$1'
		);
		const hit = Target.shoot(chords[0]);
		if (hit) {
			this.incrementScore();
		}
	}
}

new Game();
