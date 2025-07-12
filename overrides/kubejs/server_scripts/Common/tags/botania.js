ServerEvents.tags("item", event => {

    event.add('mce2:botania/basic_generating_flower', [
        'botania:endoflame',
        'botania:hydroangeas'
    ])
    
    event.add('mce2:botania/corporea_automation_device', [
        'botania:corporea_funnel',
        'botania:corporea_interceptor',
        'botania:corporea_retainer'
    ])

    event.add("mce2:botania/petal_apothecary", /botania:apothecary_.*/)
})