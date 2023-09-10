<script setup lang="ts">
// External Packages
import { ref, onBeforeMount, watch, } from 'vue'
import type { Ref } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

// Components
import TextInput from './TextInput.vue'

// Types
import PaginatedResponse from '../types/Pagination'
import Column from '../types/Column'
import Filter, { ActiveFilter, FilterOption } from '../types/Filter'

// Utils
import { getQueryFilters, flattenActiveQuery, getUnrelatedQuery } from '../utils/query'

const props = withDefaults(defineProps<{
    route: string // Route this table is displayed on
    paginatedResponse: PaginatedResponse // The Laravel paginator response
    columns: Column[] // The columns that will be displayed on the table
    rowClickable: boolean // If the rows are clickable
    filters?: Filter[] // Available filters for this table
}>(), {
    rowClickable: false,
})

const activeFilters: Ref<ActiveFilter> = ref({})

onBeforeMount(() => {
    if(props.filters) {
        activeFilters.value = {...getQueryFilters(props.filters)}
    }
})

watch(activeFilters, () => {
    let formattedFilters = flattenActiveQuery(activeFilters.value)

    if(props.filters) {
        formattedFilters = {
            ...formattedFilters,
            ...getUnrelatedQuery(props.filters),
        }
    }

    if(props.route !== '#') {
        router.get(props.route, formattedFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        })
    } 

}, {deep: true})
</script>

<template>
    <div class="inertia-table">
        <div class="inertia-table__header">
            <h3 class="inertia-table__header__title">
                <slot name="name"/>
            </h3>

            <div class="inertia-table__header__actions">
                <div
                    v-for="filter in filters"
                    :key="filter.property"
                    class="inertia-table__header__actions__filter">
                    <!-- Text -->
                    <TextInput
                        v-if="filter.type === 'text'"
                        :placeholder="filter?.placeholder ?? `${filter.name}...`"
                        v-model="<string|undefined>activeFilters[filter.property]">
                    </TextInput>

                    <!-- Select -->
                    <template v-else-if="filter.type === 'select'">
                        <span class="inertia-table__header__actions__filter__name">{{ filter.name }}:</span>
                        <Listbox
                            v-model="activeFilters[filter.property]"
                            as="div"
                            class="relative"
                            multiple>
                            <ListboxButton class="inertia-table__header__actions__filter__select">
                                <div class="inertia-table__header__actions__filter__select__button-contents">
                                    <template v-if="activeFilters[filter.property] && Array.isArray(activeFilters[filter.property])">
                                        {{ (<FilterOption[]>activeFilters[filter.property]).length ? (<FilterOption[]>activeFilters[filter.property]).map((f) => f.name)?.join(", ") : "All" }}
                                    </template>
                                    <template v-else>
                                        All
                                    </template>
                                </div>
                                <ChevronDownIcon class="inertia-table__header__actions__filter__select__button-chevron"/>
                            </ListboxButton>
                            <ListboxOptions class="inertia-table__header__actions__filter__select__options">
                                <ListboxOption
                                    v-for="option in filter.options"
                                    :key="option.value"
                                    :value="option"
                                    v-slot="{ selected }"
                                    class="inertia-table__header__actions__filter__select__options__option">
                                    <div class="inertia-table__header__actions__filter__select__options__option__check-wrapper">
                                        <CheckIcon v-if="selected"/>
                                    </div>
                                    {{ option.name }}
                                </ListboxOption>
                            </ListboxOptions>
                        </Listbox>
                    </template>
                </div>

                <!-- Other Actions -->
                <slot name="actions"/>
            </div>
        </div>

        <table class="inertia-table__table">
            <tr class="inertia-table__table__header-row">
                <th
                    v-for="(column, i) in columns"
                    :key="column.name"
                    :class="['inertia-table__table__header-row__cell', {
                        'inertia-table__table__pad-left': i === 0,
                        'inertia-table__table__pad-right': i === (columns.length-1)
                    }]">
                    {{ column.name }}
                </th>
            </tr>
            <tr
                v-for="(row, rowIndex) in paginatedResponse.data"
                :key="`row-${rowIndex}`"
                :class="['inertia-table__table__content-row', {'inertia-table__table__content-row--clickable': rowClickable}]"
                @click="rowClickable && $emit('row-click', row)">
                <td
                    v-for="(column, columnIndex) in columns"
                    :key="`row-${rowIndex}-column-${columnIndex}`"
                    :class="['py-3', {
                        'inertia-table__table__pad-left': columnIndex === 0,
                        'inertia-table__table__pad-right': columnIndex === (columns.length-1)
                    }]">
                    <slot :name="`column-${column.property}`" :row="row"/>
                </td>
            </tr>
            <tr v-if="!paginatedResponse.data.length" class="inertia-table__fill">
                <td colspan="100%">
                    <slot name="empty-state"/>
                </td>
            </tr>
        </table>

        <div class="inertia-table__footer">
            <div class="inertia-table__footer__paginator-meta">
                Showing records <span class="inertia-table__bold">{{ paginatedResponse.from ?? 0 }} - {{paginatedResponse.to ?? 0}}</span> of <span class="inertia-table__bold">{{paginatedResponse.total}}</span>.
            </div>

            <div class="inertia-table__footer__paginator-navigation">
                <Link
                    v-for="paginationButton in paginatedResponse.links"
                    :key="paginationButton.label"
                    :class="['inertia-table__footer__paginator-navigation__button', !paginationButton.url ? 'inertia-table__hidden' : '', paginationButton.active
                        ? 'inertia-table__footer__paginator-navigation__button--active'
                        : 'inertia-table__footer__paginator-navigation__button--inactive']"
                    :href="paginationButton.url ?? '#'"
                    :preserve-state="true">
                    <template v-if="paginationButton.label.endsWith('Previous')">
                        Previous
                    </template>
                    <template v-else-if="paginationButton.label.startsWith('Next')">
                        Next
                    </template>
                    <template v-else>
                        {{ paginationButton.label }}
                    </template>
                </Link>
            </div>
        </div>
    </div>
</template>

<style>
.inertia-table__fill {
    width: 100%;
    height: 100%;
}

.inertia-table__bold {
    font-weight: 700; 
    letter-spacing: 0.05em; 
}

.inertia-table__hidden {
    display: none;
}

.inertia-table {
    overflow: hidden; 
    border-radius: 0.5rem; 
    border-width: 1px; 
    background-color: #ffffff; 
}

.inertia-table__header {
    display: flex; 
    padding-top: 0.5rem;
    padding-bottom: 0.5rem; 
    padding-left: 1.5rem;
    padding-right: 1.5rem; 
    justify-content: space-between; 
    align-items: center; 
}

.inertia-table__header__title {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem; 
    font-weight: 700; 
}

.inertia-table__header__actions {
    display: flex; 
    margin-left: 1.5rem; 
    align-items: center; 
}

.inertia-table__header__actions > * {
    margin-left: 1.5rem; 
}

.inertia-table__header__actions__filter {
    display: flex; 
    align-items: center; 
}

.inertia-table__header__actions__filter:first-of-type {
    margin-left: 0; 
}

.inertia-table__header__actions__filter__name {
    margin-right: 0.5rem; 
    color: #4B5563; 
}

.inertia-table__header__actions__filter__select {
    display: flex; 
    padding: 0.5rem; 
    align-items: center; 
    border-radius: 0.5rem; 
    color: #1F2937; 
    background-color: #F3F4F6; 
}

.inertia-table__header__actions__filter__select:hover {
    background-color: #E5E7EB; 
}

.inertia-table__header__actions__filter__select__button-contents {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
    max-width: 100px;
}

.inertia-table__header__actions__filter__select__button-chevron {
    margin-left: 0.25rem; 
    width: 1.25rem; 
}

.inertia-table__header__actions__filter__select__options {
    display: flex; 
    overflow: hidden; 
    position: absolute; 
    right: 0; 
    top: 2.5rem; 
    z-index: 10; 
    padding-top: 0.25rem;
    padding-bottom: 0.25rem; 
    margin-bottom: 2rem; 
    flex-direction: column; 
    border-radius: 0.5rem; 
    border-width: 1px; 
    width: 10rem; 
    font-size: 0.875rem;
    line-height: 1.25rem; 
    color: #374151; 
    background-color: #ffffff; 
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); 
}

.inertia-table__header__actions__filter__select__options__option {
    display: flex; 
    padding-top: 0.25rem;
    padding-bottom: 0.25rem; 
    padding-left: 0.5rem;
    padding-right: 0.5rem; 
    align-items: center; 
    cursor: pointer; 
}

.inertia-table__header__actions__filter__select__options__option:hover {
    color: #ffffff; 
    background-color: #F3F4F6; 
    background-color: #6366F1; 
}

.inertia-table__header__actions__filter__select__options__option__check-wrapper {
    padding: 0.25rem; 
    margin-right: 0.5rem; 
    border-radius: 0.25rem; 
    width: 1.25rem; 
    height: 1.25rem; 
    color: #000000; 
    background-color: #F3F4F6; 
}

.inertia-table__table {
    border-bottom-width: 1px; 
    border-color: #D1D5DB; 
    width: 100%; 
    text-align: left; 
}

.inertia-table__table__pad-left {
    padding-left: 1.5rem; 
}

.inertia-table__table__pad-right {
    padding-right: 1.5rem; 
}

.inertia-table__table__header-row {
    border-color: #D1D5DB; 
    font-size: 0.875rem;
    line-height: 1.25rem; 
    color: #374151; 
    background-color: #F3F4F6; 
}

.inertia-table__table__header-row__cell {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem; 
    font-weight: 600; 
}

.inertia-table__table__content-row--clickable {
    cursor: pointer; 
}

.inertia-table__table__content-row--clickable:hover {
    background-color: #F9FAFB; 
}

.inertia-table__footer {
    display: flex; 
    padding-top: 1rem;
    padding-bottom: 1rem; 
    padding-left: 1.5rem;
    padding-right: 1.5rem; 
    justify-content: space-between; 
    align-items: center; 
}

.inertia-table__footer__paginator-meta {
    font-size: 0.875rem;
    line-height: 1.25rem; 
    color: #4B5563; 
}

.inertia-table__footer__paginator-navigation {
    display: flex; 
    margin-left: 0.5rem; 
    align-items: center; 
}

.inertia-table__footer__paginator-navigation > * {
    margin-left: 0.5rem; 
}

.inertia-table__footer__paginator-navigation__button {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem; 
    padding-left: 0.5rem;
    padding-right: 0.5rem; 
    border-radius: 0.25rem; 
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms; 
}

.inertia-table__footer__paginator-navigation__button:first-of-type {
    margin-left: 0;
}

.inertia-table__footer__paginator-navigation__button:hover {
    color: #ffffff; 
    background-color: #6366F1; 
}

.inertia-table__footer__paginator-navigation__button--active {
    color: #ffffff; 
    background-color: #6366F1; 
}

.inertia-table__footer__paginator-navigation__button--inactive {
    color: #374151; 
}
</style>