<script setup>
import { onMounted, ref } from 'vue';

defineProps({
    modelValue: {
        type: String,
        default: ""
    },
});

defineEmits(['update:modelValue']);

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input
        class="inertiajs-table__text-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        ref="input"
    />
</template>

<style scoped>
.inertiajs-table__text-input {
    border-radius: 0.375rem; 
    border-color: #E5E7EB; 
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
}
</style>