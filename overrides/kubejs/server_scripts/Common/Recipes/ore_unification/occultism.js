let crushMaterialToDust; // shortcut helper assigned later with event as a lambda param. not recommended for use.


createModule("occultism")
    .first = (event) => {
        event.remove({id: /occultism:crushing\/.*_dust_from_raw/})
        event.remove({id: /occultism:crushing\/.*_dust_from_raw_block/})

        //Gem/Ingot crushing fixing
        // their datagen looks inconsistent :V some of it has mult disabled and some doesn't
        event.remove({id: /occultism:crushing\/.*_dust_from_ingot/})
        event.remove({id: /occultism:crushing\/.*_dust_from_gem/})

        crushMaterialToDust = (output, input, oreName, sourceType) => {
            occultismCrushing(event, output, input, 100, true)
                .id(`mce2:occultism/crushing/${oreName}_dust_from_${sourceType}`)
        }

        crushMaterialToDust(Item.of(global.preferredOreProducts.dust_other.coal), Item.of("minecraft:coal"), "coal", "coal")
    }

modules.occultism.subscribe("crushed_part", (event, material, product) => {
    //console.log(crushed, part)
    
    event.remove({id: `occultism:crushing/${material}_dust`})

    occultismCrushing(event, Item.of(product, 5), 
        {tag: `forge:raw_materials/${material}`}, 200, false)
        .id(`mce2:occultism/crushing/raw_${material}_to_crushed_part`)

    occultismCrushing(event, Item.of(product, 10),
        {tag: `forge:ores/${material}`}, 200, false)
        .id(`mce2:occultism/crushing/${material}_dust`)

    /*
    occultismCrushing(event, Item.of(part, 36),
        {tag: `forge:storage_blocks/raw_${ore}`}, 200 * 9, false)
        .id(`mce2:occultism/crushing/raw_${ore}_block_to_crushed_part`)
    */


    event.shapeless(crushedRawOres[material], [
        product, product, product, product
    ]).id(`mce2:crafting/crushed_raw_${material}_assembling`)
})


modules.occultism.subscribe("dust_metal", (event, material, product) => crushMaterialToDust(Item.of(product), {tag: `forge:ingots/${material}`}, material, "ingot"))


modules.occultism.subscribe("dust_gem", (event, material, product) => crushMaterialToDust(Item.of(product), {tag: `forge:gems/${material}`}, material, "gem"))


modules.occultism.subscribe("dust_ore_gem", (event, material, product) => {
    event.remove({id: `occultism:crushing/${material}_dust`})
    crushMaterialToDust(Item.of(product, 3), {tag: `forge:ores/${material}`}, material, "ore")
})