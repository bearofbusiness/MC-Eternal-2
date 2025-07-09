
createModule("integrateddynamics")


const mechanicalSqueezing = (event, outputs, input, duration) => {
    //let fullPath = `kubejs/data/${path}.json`
    let recipe = {
        type: "integrateddynamics:mechanical_squeezer",
        "result": {
            "items": outputs
        },
        "item": input,
        "duration": duration
    }
    //console.warn(`Integrated Dynamics recipetypes are acting up with KubeJS and do not preserve their count, the Recipe has been written to a Data file at ${fullPath}, comment out the code generating it until it needs to be regenerated.`)
    //JsonIO.write(fullPath, recipe)
    return event.custom(recipe)
}

const squeezing = (event, outputs, input, duration) => {
    //let fullPath = `kubejs/data/${path}.json`
    let recipe = {
        type: "integrateddynamics:squeezer",
        "result": {
            "items": outputs
        },
        "item": input,
        "duration": duration
    }
    //console.warn(`Integrated Dynamics recipetypes are acting up with KubeJS and do not preserve their count, the Recipe has been written to a Data File at ${fullPath}, comment out the code generating it until it needs to be regenerated.`)
    //JsonIO.write(fullPath, recipe)
    return event.custom(recipe)
}

//WHY THE FUCK DOES ID NEED STACKS WITH COUNT TO BE NESTED???
const IDStack = (item, count, chance) => {
    count = count || 1
    let stack = {
        item: {
            item: item,
            count: count
        }
    };
    if(chance)
        stack.chance = chance
    return stack;
}

ServerEvents.recipes(event => {

    event.shaped("integratedterminals:terminal_storage_portable", [
        " T ",
        "CEC",
        "SWS"
    ], {
        T: "integratedterminals:part_terminal_storage",
        C: "integrateddynamics:crystalized_chorus_block",
        W: "waystones:warp_stone",
        E: "mekanism:elite_control_circuit",
        S: "minecraft:echo_shard"
    }).id("integratedterminals:crafting/terminal_storage_portable")


    event.custom({
        "type": "integrateddynamics:crafting_special_shaped_omni_directional",
        "group": "integrateddynamics:part_connector_omni_directional",
        "pattern": [
            "WLW",
            "MCM",
            "WLW"
        ],
        "key": {
            "L": {
            "item": "integrateddynamics:logic_director"
            },
            "M": {
            "item": "integrateddynamics:part_connector_mono_directional"
            },
            "C": {
            "item": "integrateddynamics:cable"
            },
            "W": {
                "item": "waystones:warp_dust"
            }
        }
    }).id("integrateddynamics:special/part_connector_omni_directional")

    event.custom({
        "type": "integrateddynamics:crafting_special_shaped_omni_directional_3",
        "group": "integrateddynamics:part_connector_omni_directional",
        "pattern": [
            "WLW",
            "MOM",
            "WLW"
        ],
        "key": {
            "L": {
            "item": "integrateddynamics:logic_director"
            },
            "M": {
            "item": "integrateddynamics:part_connector_mono_directional"
            },
            "O": {
            "item": "integrateddynamics:part_connector_omni_directional"
            },
            "W": {
                "item": "waystones:warp_dust"
            }
        }
    }).id("integrateddynamics:special/part_connector_omni_directional_copy")

})


const moduleSqueezingExcluded = [
    "copper"
]

//Mechanical Squeezer Nerf
// this shit is *too* good.
modules.integrateddynamics.subscribe("raw_material", (event, material, product) => {
    if(moduleSqueezingExcluded.includes(material)) return;

    mechanicalSqueezing(event, [IDStack(product, 2), IDStack(product, 2, 0.5)], {"tag": `forge:ores/${material}`}, 40)
        .id(`mce2:mechanical_squeezer/ore/raw_${material}`)
})


modules.integrateddynamics.first = (event) => {
    event.remove({id: /integrateddynamics:mechanical_squeezer\/ore\/raw_.*/})
    event.remove({id: /integrateddynamics:.*squeezer\/ore\/gem_emerald/})

    //Copper yields a lot more usually
    let rawCopper = global.preferredOreProducts.raw_material.copper
    let secondary = IDStack(rawCopper, 2, 0.5)
    mechanicalSqueezing(event, [IDStack(rawCopper, 6), secondary, secondary], {"tag": "forge:ores/copper"}, 40)
        .id("mce2:mechanical_squeezer/ore/raw_copper")

    //fix Emerald Ore outputting Goety emeralds
    let emerald = global.preferredOreProducts.gem.emerald

    mechanicalSqueezing(event, [IDStack(emerald, 2), IDStack(emerald, 1, 0.5)], {"tag": "forge:ores/emerald"}, 40)
        .id("mce2:mechanical_squeezer/ore/emerald")

    squeezing(event, [IDStack(emerald), IDStack(emerald, 0.5)], {"tag": "forge:ores/emerald"}, 40)
        .id("mce2:squeezer/ore/emerald")

}