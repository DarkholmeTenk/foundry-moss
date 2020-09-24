import ItemSheet5e from "../../../../systems/dnd5e/module/item/sheet.js";
import Item5e from "../../../../systems/dnd5e/module/item/entity.js"
import {DND5E} from "../../../../systems/dnd5e/module/config.js"

export function wrapItem() {
    const originalFunction = ItemSheet5e.prototype._getItemConsumptionTargets
    ItemSheet5e.prototype._getItemConsumptionTargets = function(item) {
        let originalValue = originalFunction.bind(this)(item)
        let consume = item.data.consume
        if(consume && consume.type === "attribute") {
            originalValue["resources.magicka.value"] = "resources.magicka.value"
        }
        return originalValue
    }

    DND5E.itemActionTypes.mgre = "DND5E.RegenMagicka",
    DND5E.healingTypes.magi = "DND5E.magickaRegen"

    Item5e.rollAttack
}