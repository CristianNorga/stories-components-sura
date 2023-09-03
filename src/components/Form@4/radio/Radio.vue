<script setup>
import { onBeforeMount, computed, watch, defineProps, defineEmits, reactive, ref } from 'vue';
import '../global.scss'
import './radio.scss';

// props
const props = defineProps({
  pValue: {
    type: String,
    default: '',
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
})
// events
const emits = defineEmits(['status'])

// data
const value = ref(props.pValue || '');
const state = reactive({
  isWarn: false,
  isEmpty: true,
});

// methods
function sendStatus(val) {
  let state = {
    type: 'radio',
    isEmpty: state.isEmpty,
    isError: false,
    isRequired: props.pIsRequired,
    name: props.pName,
    value: state.isEmpty ? '' : value.value,
  };

  state.isWarn = props.pIsRequired ? state.isEmpty : false;
  emits('status', state);
}
function doThis() {
  state.isEmpty = false;
  state.isWarn = false;
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

</script>

<template>
  <div class="form-input_container--wlh">
   <label class="input_label_custom"><slot name="label"></slot>
    <input :class="classInput" @click="doThis" type="radio" :name="pName" class="form-checkbox--sura" required="pIsRequired" :value="value">
    <span class="checkmark--radio"></span>
   </label>
  </div>
</template>