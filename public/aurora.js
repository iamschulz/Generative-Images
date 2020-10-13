const opts = {
	count: 7,
};
const svg = document.querySelector('#base');

const getNode = (nodeName, attrs) => {
	const node = document.createElementNS(
		'http://www.w3.org/2000/svg',
		nodeName
	);
	for (var attr in attrs) node.setAttributeNS(null, attr, attrs[attr]);
	return node;
};

const createFilter = (index) => {
	const filter = getNode('filter', { id: `aurora${index}`, height: '1000%' });
	const turbulence = getNode('feTurbulence', {
		type: 'turbulence',
		baseFrequency: '0.001 0.0001',
		result: 'noise',
		numOctaves: '8',
		seed: Math.floor(Math.random() * 100000000 * (index + 1)),
	});
	const displacement = getNode('feDisplacementMap', {
		in: 'SourceGraphic',
		in2: 'noise',
		result: 'displacement',
		scale: Math.max(150, Math.ceil(Math.random() * 500)),
		xChannelSelector: 'R',
		yChannelSelector: 'R',
	});
	filter.appendChild(turbulence);
	filter.appendChild(displacement);

	return filter;
};

const createGradient = (index) => {
	const gradient = getNode('linearGradient', { id: `grad${index}` });
	const stopCount = 2 + Math.ceil(Math.random() * 5);
	for (var stopIndex = 0; stopIndex < stopCount; stopIndex++) {
		const randColVal = () => Math.ceil(Math.random() * 255);
		const opacity =
			0.7 -
			Math.sqrt(Math.pow(stopIndex + 0.5 - stopCount / 2, 2)) /
				(stopCount / 2);
		const offset =
			100 -
			(100 / (stopIndex + 1) + (Math.ceil(Math.random() * 20) - 10));

		const style = `stop-color:rgb(${randColVal()},${randColVal()},${randColVal()});stop-opacity:${opacity}`;

		const stop = getNode('stop', {
			offset: `${offset}%`,
			style: style,
		});
		gradient.appendChild(stop);
	}
	return gradient;
};

const createAurora = (index) => {
	const aurora = getNode('g', {
		opacity: (1 / opts.count) * (index + 1),
	});
	const filter = createFilter(index);
	const gradient = createGradient(index);
	const rect = getNode('rect', {
		x: '-400',
		y: -300 + index * 200,
		transform: 'rotate(180, 1024, 540)',
		width: '2920',
		height: '1080',
		filter: `url(#aurora${index})`,
		fill: `url(#grad${index})`,
	});

	aurora.appendChild(filter);
	aurora.appendChild(gradient);
	aurora.appendChild(rect);
	return aurora;
};

for (var index = 1; index < opts.count; index++) {
	svg.appendChild(createAurora(index));
}
