export function fixSpellSlots(magickaVal, magickaMax, entity) {
    let update = {_id: entity.id}
    for (let i = 1; i <= 9; i++) {
        let slotVal = Math.floor(magickaVal / i)
        let slotMax = Math.floor(magickaMax / i)
        update[`data.spells.spell${i}.value`] = slotVal
        update[`data.spells.spell${i}.override`] = slotMax
    }
    return update
}

function getMagicka(entity, update) {
    let data = entity.data.data
    let result
    if(data.resources.magicka) {
        result = {prefix: "data.resources.magicka", ...data.resources.magicka}
    } else {
        result = {prefix: "data.spells.spell1", ...data.spells.spell1}
        result.max = result.override || result.max
    }
    let updateData = getProperty(update, result.prefix)
    if(updateData) {
        result.value = updateData.value || result.value
        result.max = updateData.override || updateData.max || result.max
    }
    return result
}

export async function wrapUpdateToken(scene, update) {
    if(scene instanceof Scene) {
        let token = new Token(scene.getEmbeddedEntity("Token", update._id));
        wrapUpdateActor(token.actor, update.actorData)
    }
}

export async function wrapUpdateActor(entity, update) {
    if(update?.data?.spells) {
        let magicka = getMagicka(entity, update)
        let change = 0;
        if(magicka.prefix == "data.spells.spell1" && update.data.spells.spell1) {
            magicka.max = update.data.spells.spell1.override || magicka.max
            magicka.value = update.data.spells.spell1.value || magicka.value
        } else {
            for (let i = 1; i <= 9; i++) {
                let slotName = `spell${i}`;
                let spellData = update.data.spells[slotName];
                if(spellData && spellData.value !== undefined) {
                    let current = entity.data.data.spells[slotName]?.value || 0
                    let newVal = spellData.value
                    change += (newVal - current) * i
                }
            }
        }
        let newUpdate = fixSpellSlots(magicka.value + change, magicka.max, entity)
        newUpdate[`${magicka.prefix}.value`] = magicka.value + change
        if(magicka.prefix == "data.spells.spell1" && update.data.spells.spell1?.override) {
            delete newUpdate["data.spells.spell1.override"]
        }
        mergeObject(update, newUpdate)
    } else if(update?.data?.resources?.magicka) {
        let {value, max} = getMagicka(entity, update)
        let newUpdate = fixSpellSlots(value, max, entity)
        mergeObject(update, newUpdate)
    }
}