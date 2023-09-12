import Filter from '../types/Filter'
import FilterObject from '../types/Object'

function getQueryKeyPairs() : string[] {
    return decodeURI(window.location.search.replace('?', '')).split('&')
}

export function getQueryFilters(filters: Filter[]) : FilterObject {
    let activeFilters: FilterObject = {}

    for (const keyValuePair of getQueryKeyPairs()) {
        let [key, value] = keyValuePair.split('=')

        if (key.includes('[') && key.includes(']')) { // Is array of values
            key = key.split('[')[0]

            const foundFilter : Filter | undefined = filters.find(filter => filter.property === key)
            if(foundFilter && foundFilter.options) {
                if(!(key in activeFilters)) {
                    activeFilters[key] = []
                }
                activeFilters[key].push(foundFilter.options.find(({value: v}) => v === value))
            }
        } else {
            if(filters.find((filter: Filter) => filter.property === key)) {
                activeFilters[key] = value
            }
        }
    }

    return activeFilters
}

export function flattenActiveQuery(activeFilters: FilterObject) : FilterObject {
    let formattedFilters: FilterObject = {}

    Object.keys(activeFilters).forEach(property => {
        const value = activeFilters[property]

        formattedFilters[property] = Array.isArray(value)
            ? value.map(({value: v}) => v)
            : value
    })

    return formattedFilters
}

export function getUnrelatedQuery(filters: Filter[]) : FilterObject {
    let formattedFilters: FilterObject = {}

    for (const keyValuePair of getQueryKeyPairs()) {
        let [key, value] = keyValuePair.split('=')
        if (key.includes('[') && key.includes(']')) { // Is array of values
            key = key.split('[')[0]
            const foundFilter = filters.find(filter => filter.property === key)
            if(!foundFilter) {
                if(!(key in formattedFilters)) {
                    formattedFilters[key] = []
                }

                formattedFilters[key].push(value)
            }
        } else { // Is single value
            if(!filters.find(filter => filter.property === key)) {
                formattedFilters[key] = value
            }
        }
    }

    return formattedFilters
}