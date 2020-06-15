import Entity from "../../../systems/dnd5e/module/actor/entity.js"
import SpellCastDialog from "../../../systems/dnd5e/module/apps/spell-cast-dialog.js";
import AbilityTemplate from "../../../systems/dnd5e/module/pixi/ability-template.js";

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

export function fixMagicka(magickaVal, entity) {
    let magicka = magickaVal
    console.log(`MOSS | Magicka was ${magickaVal}`)
    for (let i = 1; i <= 9; i++) {
        let old = Math.floor(magickaVal / i)
        let current = entity.data.data.spells[`spell${i}`].value || 0
        if(old != current) {
            magicka += (current - old) * i
        }
    }
    console.log(`MOSS | Magicka is now ${magicka}`)
    return magicka
}

export async function wrap(originalCall, entity, callArgs) {
    let { value: magickaVal, max: magickaMax } = entity.data.data.resources.magicka
    await entity.update(fixSpellSlots(magickaVal, magickaMax, entity))
    let result = await Promise.resolve(originalCall(...callArgs))
    await entity.update({"data.resources.magicka.value": fixMagicka(magickaVal, entity)})
    return result
}

export default function wrapEntity() {
    Entity.prototype.useSpell = async function (item, { configureDialog = true } = {}) {
        if (item.data.type !== "spell") throw new Error("Wrong Item type");
        const itemData = item.data.data;

        // Configure spellcasting data
        let lvl = itemData.level;
        let castLvl = 0
        const usesSlots = (lvl > 0) && CONFIG.DND5E.spellUpcastModes.includes(itemData.preparation.mode);
        const limitedUses = !!itemData.uses.per;
        let consume = `spell${lvl}`;
        let placeTemplate = false;

        let { value: magickaVal, max: magickaMax } = this.data.data.resources.magicka

        // Configure spell slot consumption and measured template placement from the form
        if (usesSlots && configureDialog) {
            await this.update(fixSpellSlots(magickaVal, magickaMax, this))
            const spellFormData = await SpellCastDialog.create(this, item);
            const isPact = spellFormData.get('level') === 'pact';
            const lvl = isPact ? this.data.data.spells.pact.level : parseInt(spellFormData.get("level"));
            if (Boolean(spellFormData.get("consume"))) {
                consume = isPact ? 'pact' : `spell${lvl}`;
                castLvl = lvl
            } else {
                consume = false;
            }
            placeTemplate = Boolean(spellFormData.get("placeTemplate"));

            // Create a temporary owned item to approximate the spell at a higher level
            if (lvl !== item.data.data.level) {
                item = item.constructor.createOwned(mergeObject(item.data, { "data.level": lvl }, { inplace: false }), this);
            }
        }

        // Update Actor data
        if (usesSlots && consume && (lvl > 0)) {
            let updateVar = fixSpellSlots(magickaVal - castLvl, magickaMax, this)
            updateVar[`data.resources.magicka.value`] =  Math.max(magickaVal - castLvl, 0)
            await this.update(updateVar)
        }

        // Update Item data
        if (limitedUses) {
            const uses = parseInt(itemData.uses.value || 0);
            if (uses <= 0) ui.notifications.warn(game.i18n.format("DND5E.ItemNoUses", { name: item.name }));
            await item.update({ "data.uses.value": Math.max(parseInt(item.data.data.uses.value || 0) - 1, 0) })
        }

        // Initiate ability template placement workflow if selected
        if (placeTemplate && item.hasAreaTarget) {
            const template = AbilityTemplate.fromItem(item);
            if (template) template.drawPreview(event);
            if (this.sheet.rendered) this.sheet.minimize();
        }

        // Invoke the Item roll
        return item.roll();
    }
}