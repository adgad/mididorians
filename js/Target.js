import { Note, Key, ChordType } from '@tonaljs/tonal';

const complexityFilter = {
	simple: (c) => ['Major', 'Minor'].includes(c.quality) && c.name,
	intermediate: (c) => c.name,
	hard: (c) => c,
};

const getChordTarget = ({
	chordLength = 3,
	chordComplexity = 'simple',
	chordRoots = ['C'],
} = {}) => {
	const randomNote = chordRoots[Math.floor(Math.random() * chordRoots.length)];
	const validChordTypes = ChordType.all()
		.filter(complexityFilter[chordComplexity])
		.filter((c) => c.intervals.length <= parseInt(chordLength))
		.map((c) => c.aliases[0]);

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

	static create(settings) {
		const { root, quality } = getChordTarget(settings);

		const existing = Target.all.get(root + quality);
		if (existing) {
			return;
		}

		const newTarget = new Target(root, quality, settings.speed);
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
			target.animation.cancel();
			target.remove();
		}
	}

	constructor(root, quality, speed, onFall) {
		this.root = root;
		this.quality = quality;
		this.target = root + quality;
		this.speed = speed;
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
				Math.random() * (document.body.offsetWidth - targetEl.clientWidth - 50)
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
				duration: parseInt(this.speed),
				fill: 'forwards',
			}
		);
		this.el = targetEl;
	}
}
