import DataObject from './Object'

export default interface PaginatedResponse {
    from: string | number
    to: string | number
    total: string | number
    links: Link[]
    data: DataObject[]
}

export interface Link {
    active: boolean
    label: string
    url: string
}