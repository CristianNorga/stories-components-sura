<script setup>
import { ref } from 'vue'
import Input from './Form@4/Input.vue'
import Select from './Form@4/Select.vue'

defineProps({
  msg: String,
})

</script>

<template>
  <Select />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
