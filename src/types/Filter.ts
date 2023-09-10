export default interface Filter {
    name: string
    property: string
    type: 'text' | 'select'
    placeholder?: string
    options?: FilterOption[]
}

export interface FilterOption {
    name: string
    value: string
}

export interface ActiveFilter {
    [key: string]: FilterOption[] | string | undefined
}