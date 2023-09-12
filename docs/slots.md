# Slots

## Static slots

These slots will always be present on a table.

### name

v-slot: `None`

This slot simply allows you to set the name of the table that will be shown in the header.

#### Example

```vue
<template>
    <Table>
        <template #name>
            Users
        </template>
    </Table>
</template>
```

### actions

v-slot: `None`

This slot will appear after your table's filter options in the far right of the table header. You can place any table related actions here.

#### Example

```vue
<template>
    <Table>
        <template #actions>
            <button @click.prevent="createUser">
                Create New User
            </button>
        </template>
    </Table>
</template>
```

### empty-state

v-slot: `None`

This slot will appear where rows would appear if there are no rows to display. It should provide the empty/zero state for your table.

#### Example

```vue
<template>
    <Table>
        <template #empty-state>
            Nothing to see here, create a user to populate this table
        </template>
    </Table>
</template>
```

## Dynamic Slots

These slots will be programmatically created based on the props you pass to the table.

### column-[column.property]

v-slot: `row`

This slot will be created for every column in your `columns` prop. It will setup indicate how that column should be rendered in every row.

#### Example

```vue
<template>
    <Table :columns="[{name: 'Email', property: 'email'}, {name: 'Name', property: 'name'}]">
        <template #column-email="{row}">
            {{ row.email }}
        </template>
        
        <template #column-name="{row}">
            {{ row.name }}
        </template>
    </Table>
</template>
```