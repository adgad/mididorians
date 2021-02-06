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
		});
		this.els = {
			currentChord: document.querySelector('.currentChord'),
			targets: document.querySelector('.targets'),
			startButton: document.querySelector('.start-game'),
			score: document.querySelector('.score'),
		};
		this.els.startButton.addEventListener('click', this.start.bind(this));
		this.gameLoop = null;
	}

	start() {
		document.body.classList.add('started');
		this.resetScore();
		this.piano.start();
		this.createTarget();
		this.gameLoop = setInterval(() => {
			this.createTarget();
		}, 5000);
	}

	async createTarget() {
		try {
			const target = Target.create();
			await target.invaded;
			console.log('target has invaded', target.target);
			this.gameOver();
			console.log('Game Over!');
		} catch (err) {
			console.log('no biggie error');
		}
	}

	gameOver() {
		document.body.classList.remove('started');
		Target.clear();
		this.score = 0;
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

	async onChange({ notes, chords }) {
		console.log({ notes, chords });
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
