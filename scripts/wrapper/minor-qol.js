import { wrap } from "./entity-spell-wrapper.js";

export default function wrapMinorQOL() {
    if(window.MinorQOL) {
        console.log("MOSS - Overwriting MinorQOL")
        if(window.MinorQOL.doRoll) {
            console.log("MOSS - Overwriting MinorQOL.doRoll")
            let original = window.MinorQOL.doRoll
            window.MinorQOL.doRoll = async function() {
                let token = (arguments[2] || {}).token
                let actor;
                if (token) {
                    actor = typeof token === "string" ? canvas.tokens.get(token).actor : token.actor;
                } else {
                    let speaker = ChatMessage.getSpeaker();
                    token = canvas.tokens.get(speaker.token);
                    actor = token ? token.actor : game.actors.get(speaker.actor);
                }
                if(actor) {
                    return wrap(original, actor, arguments)
                } else {
                    return original(arguments)
                }
            }
        }
        if(window.MinorQOL.doCombinedRoll) {
            console.log("MOSS - Overwriting MinorQOL.doCombinedRoll")
            let original = window.MinorQOL.doCombinedRoll
            window.MinorQOL.doCombinedRoll = async function() {
                let actor = (arguments[0] || {}).actor
                if(actor) {
                    return wrap(original, actor, arguments)
                } else {
                    return original(arguments)
                }
            }
        }
    }
}