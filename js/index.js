import MIDIInput from './MIDIInput';
import Piano from './Piano';
import Target from './Target';
import { Note, Key, ChordType } from '@tonaljs/tonal';

class Game {
	constructor() {
		this.els = {
			currentChord: document.querySelector('.currentChord'),
			targets: document.querySelector('.targets'),
			startButton: document.querySelector('.start-game'),
			level: document.querySelector('.level .value'),
			score: document.querySelector('.score .value'),
			error: document.querySelector('.error'),
		};

		this.piano = new Piano();
		this.input = new MIDIInput({
			onChange: this.onChange.bind(this),
			onNoteOn: this.piano.noteOn.bind(this.piano),
			onNoteOff: this.piano.noteOff.bind(this.piano),
			onError: this.onError.bind(this),
		});
		this.els.startButton.addEventListener('click', this.start.bind(this));
		this.createTargetRate = 5000; // start at 5 seconds
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
		this.resetLevel();
		this.piano.start();
		this.createTarget();
		this.gameLoop = setTimeout(() => { this.loop() }, this.createTargetRate);
	}

	async loop() {
		this.createTarget();
		this.gameLoop = setTimeout(() => { this.loop() }, this.createTargetRate);
	}

	async createTarget() {
		try {
			const target = Target.create(this.settings);
			await target.invaded;
			this.gameOver();
		} catch (err) { }
	}

	gameOver() {
		document.body.classList.remove('started');
		Target.clear();
		this.els.error.textContent = 'Game Over! You s-chord ' + this.score;
		this.resetScore();
		this.resetLevel();
		clearTimeout(this.gameLoop);
	}

	incrementScore() {
		this.score++;
		this.els.score.textContent = this.score;
	}

	resetScore() {
		this.score = 0;
		this.els.score.textContent = this.score;
	}

	incrementLevel() {
		this.level++;
		this.els.level.textContent = this.level;
		this.createTargetRate = this.createTargetRate * 0.9;
	}

	resetLevel() {
		this.level = 1;
		this.els.level.textContent = this.level;
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
			// Increase createTargetRate by 10% if user scored 10 points
			// Stop increasing when a rate of 100ms is reached
			if (
				this.score > 0 &&
				this.score % 10 == 0 &&
				this.createTargetRate > 100
			) {
				this.incrementLevel();
			}
		}
	}
}

new Game();
