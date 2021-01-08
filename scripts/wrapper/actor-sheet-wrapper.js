import { getSlotCost } from "./slot-costs.js";

export function addCostTable(_, html) {
	let list = html.find('.spellbook-header .item-name');
	list.each((index, item)=>{
		let text = item.textContent
		let match = text.match(/(\d+).* Level/)
		if(match) {
			let level = parseInt(match[1])
			let cost = getSlotCost(level)
			item.textContent += ` - ${cost} magicka`
		}
	})
}