import ActorSheet5eCharacter from "../../../../systems/dnd5e/module/actor/sheets/character.js";
import ActorSheet5eNPC from "../../../../systems/dnd5e/module/actor/sheets/npc.js";
import {wrapUpdateActor} from "./wrapper/entity-spell-wrapper.js"
import { wrapItem } from "./wrapper/item-wrapper.js";

function wrapResources(originalCall) {
    return function() {
        const sheetData = originalCall.call(this);
        let resource = sheetData.data.resources.magicka || {
            min: 0,
            max: 10,
            label: "Magicka",
            placeholder: "magicka",
            name: "magicka",
            sr: true,
            lr: true
        }
        resource.name= "magicka"
        let newArr = [...(sheetData.resources || [])]
        let r = newArr.findIndex(i=>i.placeholder == "magicka")
        if(r == -1) {
            newArr.push(resource)
        }
        sheetData.resources = newArr
        return sheetData
    }
}

Hooks.on('ready', async ()=>{
    console.log("MOSS | Getting ready")
    ActorSheet5eCharacter.prototype.getData = wrapResources(ActorSheet5eCharacter.prototype.getData)
    ActorSheet5eNPC.prototype.getData = wrapResources(ActorSheet5eNPC.prototype.getData)

    wrapItem()
})

Hooks.on("preUpdateActor", wrapUpdateActor)