# Props

These are the props available on the table

## route

required: **yes**

type: `String`

The route where the page is rendered. Inertia will return this route if you call `route({name of Laravel route})`. This will be called when you change a filter or do some other action that requires another request to be made for the table.

### Example

```vue
<Table :route="route('users.edit')">
```

## paginatedResponse

required: **yes**

type: `PaginatedResponse`

The response returned from Laravel's length-aware paginator. Must include the following fields

- `from`
- `to`
- `total`
- `links`
    * `links.*.active`
    * `links.*.label`
    * `links.*.url`
- `data`

### Example

#### Backend

The backend needs to pass the length-aware paginator from the backend to be rendered.

```php
return Inertia::render('Settings/Workspace/Users/Edit', [
    'users' => User::paginate()->withQueryString(),
]);
```

#### Frontend

The frontend can then consume the paginated response.

```vue
<script setup>
defineProps({
    users: Object // Collect users from Laravel
})
</script>

<Table :paginated-response="users">
```

## columns

required: **yes**

type: `Column[]`

An array of columns. Each column must contain 

- `name` - The name of the column, will be displayed in the header
- `property` - The property this column represents, will be used as the name of the slot

### Example

```vue
<Table :columns="[{'name': 'Email', 'property': 'email'}]">
    <template #column-email="{ row }">
        User's email is {{ row.email }}
    </template>
</Table>
```

## rowClickable

required: **no**

type: `Boolean`

default: `false`

Indicates if a row can be clicked or not. If a row can be clicked, and it is, it will emit the `row-click` event with the row.

### Example

```vue
<script setup>
const rowClicked = (row) => {
    console.log(`row with id ${row.id} was clicked`)
}
</script>

<Table 
    :row-clickable="true"
    @row-clicked="rowClicked">
</Table>
```

## filters

required: **no**

type: `Filter[]`

default: `null`

The available filters for a table. There are two types of filters, `text` and `select`. 

### Text Filter

This type of filter is useful when you need to search a table. A text filter accepts

- `name` - The pretty name displayed for this filter
- `property` - The property is what will be send as the query parameter key to the [route](#route) when you change this filter
- `type` - Indicates the type of filter, if you wish to use text you must set this to `text`
- `placeholder` - Only valid for `text` filters, this will be placed in the input's placeholder

#### Example

```vue
<Table 
    :filters="[{
        name: 'Search', 
        property: 'search', 
        type: 'text', 
        placeholder: 'Search for a user...'
    }]">
</Table>
```

### Select Filter

This type of filter is useful when you need to filter a table by predefined values. 

- `name` - The pretty name displayed for this filter
- `property` - The property is what will be send as the query parameter key to the [route](#route) when you change this filter
- `type` - Indicates the type of filter, if you wish to use text you must set this to `select`
- `options` - The available options for this filter
    * `options.*.name` - The display name for a specific option
    * `options.*.value` - The value that will be sent as the query parameter value to [route](#route) 

#### Example

```vue
<Table 
    :filters="[{
        name: 'Roles', 
        property: 'role', 
        type: 'select'
        options: [
            {name: 'Administrator', value: 'admin'},
            {name: 'Member', value: 'member'},
        ]
    }]">
</Table>
```