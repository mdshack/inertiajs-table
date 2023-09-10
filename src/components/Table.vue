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

    router.get(props.route, formattedFilters, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    })
}, {deep: true})
</script>

<template>
    <div class="bg-white border rounded-lg overflow-hidden">
        <div class="px-6 py-2 flex items-center justify-between">
            <h3 class="font-bold py-2">
                <slot name="name"/>
            </h3>

            <div class="flex items-center space-x-6">

                <div
                    v-for="filter in filters"
                    :key="filter.property"
                    class="flex items-center">
                    <!-- Text -->
                    <TextInput
                        v-if="filter.type === 'text'"
                        :placeholder="filter?.placeholder ?? `${filter.name}...`"
                        v-model="<string|undefined>activeFilters[filter.property]">
                    </TextInput>

                    <!-- Select -->
                    <template v-else-if="filter.type === 'select'">
                        <span class="text-gray-600 mr-2">{{ filter.name }}:</span>
                        <Listbox
                            v-model="activeFilters[filter.property]"
                            as="div"
                            class="relative"
                            multiple>
                            <ListboxButton class="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-lg flex items-center">
                                <div class="truncate max-w-[100px] ">
                                    <template v-if="activeFilters[filter.property] && Array.isArray(activeFilters[filter.property])">
                                        {{ (<FilterOption[]>activeFilters[filter.property]).map((f) => f.name)?.join(", ") }}
                                    </template>
                                    <template v-else>
                                        All
                                    </template>
                                </div>
                                <ChevronDownIcon class="w-5 ml-1"/>
                            </ListboxButton>
                            <ListboxOptions class="absolute top-10 right-0 mb-8 w-40 z-10 bg-white border rounded-lg flex flex-col overflow-hidden shadow text-sm text-gray-700 py-1">
                                <ListboxOption
                                    v-for="option in filter.options"
                                    :key="option.value"
                                    :value="option"
                                    v-slot="{ selected }"
                                    class="py-1 px-2 hover:bg-gray-100 flex items-center hover:text-white hover:bg-indigo-500 cursor-pointer">
                                    <div class="w-5 h-5 bg-gray-100 text-black rounded mr-2 p-1">
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

        <table class="w-full text-left border-b border-gray-300">
            <tr class="bg-gray-100 text-gray-700 border-y border-gray-300 text-sm ">
                <th
                    v-for="(column, i) in columns"
                    :key="column.name"
                    :class="['py-2 font-semibold', {
                        'pl-6': i === 0,
                        'pr-6': i === (columns.length-1)
                    }]">
                    {{ column.name }}
                </th>
            </tr>
            <tr
                v-for="(row, rowIndex) in paginatedResponse.data"
                :key="`row-${rowIndex}`"
                :class="{'hover:bg-gray-50 cursor-pointer': rowClickable}"
                @click="rowClickable && $emit('row-click', row)">
                <td
                    v-for="(column, columnIndex) in columns"
                    :key="`row-${rowIndex}-column-${columnIndex}`"
                    :class="['py-3', {
                        'pl-6': columnIndex === 0,
                        'pr-6': columnIndex === (columns.length-1)
                    }]">
                    <slot :name="`column-${column.property}`" :row="row"/>
                </td>
            </tr>
            <tr v-if="!paginatedResponse.data.length" class="w-full h-full">
                <td colspan="100%">
                    <slot name="empty-state"/>
                </td>
            </tr>
        </table>

        <div class="flex justify-between items-center py-4 px-6">
            <div class="text-sm text-gray-600">
                Showing records <span class="font-bold tracking-wider">{{ paginatedResponse.from ?? 0 }} - {{paginatedResponse.to ?? 0}}</span> of <span class="font-bold tracking-wider">{{paginatedResponse.total}}</span>.
            </div>

            <div class="flex items-center space-x-2">
                <Link
                    v-for="paginationButton in paginatedResponse.links"
                    :key="paginationButton.label"
                    :class="['py-1 px-2 hover:bg-indigo-500 hover:text-white rounded transition', !paginationButton.url ? 'hidden' : '', paginationButton.active
                        ? 'text-white bg-indigo-500'
                        : 'text-gray-700']"
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