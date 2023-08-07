<script setup>
import { ref } from 'vue'
import Input from './Form@4/Input.vue'
import Select from './Form@4/Select.vue'
import Form from './Form@4/Form.vue'

defineProps({
  msg: String,
})

</script>

<template>
  <Form p-gear-id="m5qe6tud0ei" p-on-submit-type="executeAction" p-on-submit-goto-Url="https://google.com" :p-smartcapture-form-id="439" p-source-key="dataextensiontest">
    <template v-slot:content="{verifying, getStatus, changeFamilyData, familyData, familyListener}">
      <div class="col-12">
        <Select />
      </div>
      <div class="col-12">
        <Input />
      </div>
    </template>
  </Form>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
