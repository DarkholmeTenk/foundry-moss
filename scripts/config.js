import { getSettings, loadSettings } from "./wrapper/slot-costs.js";

const prefix = "moss."

const configOptions = [
	...getSettings()
]

function reload() {
	let config = {}
	configOptions.forEach((setting)=>{
		config[setting.name] = game.settings.get("MOSS", setting.name)
	})
	loadSettings(config);
}

export function registerSettings() {
	configOptions.forEach(setting=>{
		let option = {
			...setting,
			name: game.i18n.localize(`moss.${setting.name}.name`),
			hint: game.i18n.localize(`moss.${setting.name}.hint`),
			scope: "world",
			config: true,
			onChange: reload
		}
		game.settings.register("MOSS", setting.name, option)
	})
	reload();
}