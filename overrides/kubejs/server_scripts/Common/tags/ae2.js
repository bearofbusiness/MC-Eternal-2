ServerEvents.tags("item", event => {

    //Any Colored Cable
    event.add("mce2:ae2/colored_cables", [
        /ae2:(?!fluix).*_cable/
    ])

    //Any Budding Certus Quartz
    event.add("mce2:ae2/budding_quartz", [
        /ae2:.*_budding_quartz/
    ])
})