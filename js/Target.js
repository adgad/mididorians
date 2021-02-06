const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
import { Note, Key, ChordType } from '@tonaljs/tonal';

console.log(ChordType.all());
const getChordTarget = ({
	length = 3,
	qualities = ['Major', 'Minor'],
} = {}) => {
	const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
	const validChordTypes = ChordType.all()
		.filter(
			(c) =>
				c.intervals.length === length && qualities.includes(c.quality) && c.name
		)
		.map((c) => c.aliases[0]);
	console.log({ validChordTypes });
	const randomType =
		validChordTypes[Math.floor(Math.random() * validChordTypes.length)];
	return {
		root: randomNote,
		quality: randomType,
	};
};

export default class Target {
	static all = new Map();

	static targetsEl = document.querySelector('.targets');

	static create() {
		const { root, quality } = getChordTarget();

		const existing = Target.all.get(root + quality);
		if (existing) {
			console.log(`${root + quality} already exists!`);
			return;
		}

		const newTarget = new Target(root, quality);
		Target.all.set(newTarget.target, newTarget);
		return newTarget;
	}

	static shoot(chord) {
		const found = Target.all.get(chord);
		if (found) {
			found.animation.cancel();
			found.remove();
			return true;
		}
	}

	static clear() {
		for (let target of Target.all.values()) {
			target.remove();
		}
	}

	constructor(root, quality, onFall) {
		this.root = root;
		this.quality = quality;
		this.target = root + quality;
		this.render();
		this.invaded = this.animation.finished;
	}

	remove() {
		this.el.parentElement.removeChild(this.el);
		Target.all.delete(this.target);
	}

	async render() {
		const targetEl = document.createElement('div');
		if (this.quality === 'M') {
			targetEl.innerHTML = `<div class="target__root">${this.root}</div>`;
		} else {
			targetEl.innerHTML = `<div class="target__root">${this.root}</div><div class="target__quality">${this.quality}</div>`;
		}
		targetEl.classList.add('target');
		targetEl.style.left =
			Math.floor(
				Math.random() * (document.body.offsetWidth - targetEl.clientWidth)
			) + 'px';
		Target.targetsEl.appendChild(targetEl);
		this.animation = targetEl.animate(
			[
				{ transform: 'translateY(0)' },
				{
					transform: `translateY(calc(100vh - ${targetEl.clientHeight + 2}px)`,
				},
			],
			{
				// timing options
				duration: 10000,
				fill: 'forwards',
			}
		);
		this.el = targetEl;
	}
}
