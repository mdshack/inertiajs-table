# Getting Started

## Installation

1. Install the package

```bash
npm install inertiajs-table
```

2. Import the default stylesheet in your `app.js`

```bash
import "inertiajs-table/dist/style.css";
```

3. Setup a backend route to render a paginated table view

```php
UserController.php

...

public function edit(Request $request) // users.edit route
{
   return Inertia::render('Users/Edit', [
      'users' => User::paginate(5)->withQueryString()
   ]);
}

...
```

4. Setup a frontend view to use render the table

```vue
<script setup>
import { Table } from 'inertiajs-table'

defineProps({
    users: Object // Paginated response from backend
})
</script>

<template>
    <Table
        :route="route('users.edit')"
        :paginated-response="users"
        :columns="[
            { name: 'Name', property: 'name' },
            { name: 'Email', property: 'email' },
        ]">

        <template #name>
            Users
        </template>

        <template #empty-state>
            No users exist, check back later!
        </template>

        <template #name="{row}">{{ row.name }}</template>

        <template #email="{row}">{{row.email}}</template>

    </Table>
</template>
```