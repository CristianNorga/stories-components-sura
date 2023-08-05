<script setup>
import { ref } from 'vue'
import Input from './Form@4/Input.vue'

defineProps({
  msg: String,
})

</script>

<template>
  <Input />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
