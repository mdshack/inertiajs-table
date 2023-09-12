# Events

These are the events that are emitted by the table.

## row-click

This event is emitted when the [rowClickable](/props.html#rowclickable) prop is `true`. It will be emitted with the row that was clicked.

### Example

```vue
<script setup>
const handleRowClicked = (row) => {
    console.log(`row ${row.id} was clicked`)
}
</script>
<template>
    <Table @row-clicked="handleRowClicked">
</template>
```
