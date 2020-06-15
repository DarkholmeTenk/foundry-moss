import ActorSheet5eCharacter from "../../systems/dnd5e/module/actor/sheets/character.js";
import wrapEntity, {wrap} from "./wrapper/entity-spell-wrapper.js"
import wrapMinorQOL from "./wrapper/minor-qol.js";

Hooks.on('ready', async ()=>{
    console.log("MOSS | Getting ready")
    const originalGetData = ActorSheet5eCharacter.prototype.getData;
    ActorSheet5eCharacter.prototype.getData = function () {
        const sheetData = originalGetData.call(this);
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

    wrapEntity()

    wrapMinorQOL()
})

Hooks.on("renderActorSheet", (sheet)=>{

})