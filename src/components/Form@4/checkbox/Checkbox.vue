<script setup>
import { computed, watch, defineProps, defineEmits, reactive, ref } from 'vue';
import '../global.scss'
import './checkbox.scss';

// props
const props = defineProps({
  pValue: {
    type: String,
    default: 'Si',
  },
  pName: {
    type: String,
    default: '',
  },
  pIsRequired: {
    type: Boolean,
    default: false,
  },
  pIsVerifying: {
    type: Boolean,
    default: false,
  },
  pIsCheck: {
    type: Boolean,
    default: false,
  },
  pIsStatusAfter: {
    type: Boolean,
    default: true,
  },
})
// events
const emits = defineEmits(['status'])

// data
const value = ref(props.pValue || '');
const state = reactive({
  isWarn: false,
  isCheck: props.pIsCheck,
});

// methods
function sendStatus(val) {
  let state = {
    type: 'radio',
    isEmpty: !state.isCheck,
    isError: false,
    isRequired: props.pIsRequired,
    name: props.pName,
    value: !state.isCheck ? '' : value.value,
  };

  state.isWarn = props.pIsRequired ? !state.isCheck : false;
  emits('status', state);
}
function doThis() {
  state.isWarn = false;
  state.isCheck = !state.isCheck;
  props.pIsStatusAfter ? '' : sendStatus(true);
}

// Lifecycle


// computed
const classInput = computed(() => {
  return {
    'radio-warn': state.isWarn,
  };
})

// watch
watch(() => props.pIsVerifying, (val) => {
  if (val) sendStatus(val);
})
watch(() => props.pValue, (val) => {
  value.value = val;
})
watch(() => props.pIsCheck, (val) => {
  state.isCheck = val;
})

</script>

<template>
  <div class="form-input_container--wlh">
   <label class="input_label_custom"><slot name="label"></slot>
    <input @click="doThis" type="checkbox" :name="pName" class="form-checkbox--sura" required="pIsRequired" :value="value" v-model="state.isCheck">
    <span :class="classInput" class="checkmark--checkbox"></span>
   </label>
  </div>
</template>