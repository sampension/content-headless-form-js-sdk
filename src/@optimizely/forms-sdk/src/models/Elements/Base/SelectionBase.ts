import { InputElementBase, InputElementBaseProperties } from "./InputElementBase"

export interface SelectionBase extends InputElementBase {
    properties: SelectionBaseProperties
}

export interface SelectionBaseProperties extends InputElementBaseProperties {
    allowMultiSelect: string
    feed: string
    items: FeedItem[]
    predefinedValue: string
}

export interface FeedItem {
    caption: string
    value: string
    checked: boolean
}