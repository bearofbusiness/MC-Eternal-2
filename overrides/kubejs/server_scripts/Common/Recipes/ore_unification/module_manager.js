//priority: 100

/*
    occultism: {
        ore_gem: (event) => {
            
        }
    }
*/

const modules = {}

/**
 * Should never need to be called. use `modules.[groupName].subscribe(materialType, module)` instead
 * @param {String} group Group to add the Module to
 * @param {String} materialType Material Type that will be passed in later
 * @param {Function} module 
 */
const subscribeToGroup = (group, materialType, module) => {
    let moduleGroup = modules[group]
    if(moduleGroup) {
        if(moduleGroup[materialType])
            console.warn(`Module "${materialType}" already exists for group "${group}"!`)
        else 
            moduleGroup[materialType] = module
    } else
        console.warn(`No Module Group "${group}" is initialized.`)
}

/**
 * 
 * @param {String} groupName Name of the new Module Group
 * @returns a new Module, using the passed groupName as its key
 */
const createModule = (groupName) => {
    modules[groupName] = {
        subscribe: (materialType, module) => subscribeToGroup(groupName, materialType, module)
    }
    return modules[groupName]
}

//Load Modules
ServerEvents.recipes(event => {

    for (let [moduleGroup, moduleList] of Object.entries(modules)) {
        console.log(`Resolving Ore Processing modules for "${moduleGroup}"`)
        moduleList.first(event) //run "first" module
        // remove first and subscribe functions from this module.
        delete moduleList.first
        delete moduleList.subscribe
        // then run the module.
        for (let [materialType, module] of Object.entries(moduleList)) {
            console.log(`Resolving module "${materialType}"`)
            for (let [material, product] of Object.entries(global.preferredOreProducts[materialType]))
                module(event, material, product)
            console.log(`Finished resolving module "${materialType}"`)
        }
    }
})