const DefaultCosts = {
	0: 0,
	1: 1,
	2: 3,
	3: 5,
	4: 8,
	5: 12,
	6: 16,
	7: 20,
	8: 25,
	9: 30
}


export function getSlotCapacity(slot) {
	return 1;
}

let costs = {
	0: 0,
	1: 1,
	2: 3,
	3: 5,
	4: 8,
	5: 12,
	6: 16,
	7: 20,
	8: 25,
	9: 30
}

export function getSlotCost(slot) {
	return costs[slot] ?? slot
}

export function getSettings() {
	return Object.keys(DefaultCosts).map((level)=>{
		return {
			name: `Level${level}Cost`,
			default: DefaultCosts[level],
			type: Number
		}
	});
}

export function loadSettings(config) {
	let newCosts = {}
	Object.keys(DefaultCosts).map((level)=>{
		let cost = config[`Level${level}Cost`] ?? DefaultCosts[level];
		newCosts[level] = cost;
	})
	costs = newCosts;
}