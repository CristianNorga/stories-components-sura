<script setup>
import { computed, watch, defineProps, defineEmits, reactive, ref } from 'vue';
import '../global.scss'
import './switch.scss';

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
  pIsCheck: {
    type: Boolean,
    default: false,
  },
  pSideLabel: {
    type: String,
    default: 'left',
  },
  pIsVerifying: {
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
const sideLabel = computed(() => {
  return props.pSideLabel == 'left' ? 'order: 1' : 'order: -1';
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
  <div class="form-input_container--wlh align-items-center">
    <slot class="slot-label" name="label"></slot>
    <label class="input-label-switche position-relative d-block" :style="sideLabel">
      <input @click="doThis" type="checkbox" :name="props.pName" class="position-absolute end-0"
        :value="value" v-model="state.isCheck">
      <i class="fw-normal fst-normal rounded rounded-pill position-absolute top-0 start-0"></i>
    </label>
  </div>
</template>