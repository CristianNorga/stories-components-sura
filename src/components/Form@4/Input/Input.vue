<script setup>
import '../global.scss'
import './input.scss';
import { onBeforeMount, computed, watch, defineProps, defineEmits, reactive, ref } from 'vue';

// props
const props = defineProps({
  pIsAux: {
    type: Boolean,
    default: true,
  },
  pFamilyReceive: {
    type: Array,
    default: () => ([]),
  },
  pFamilyData: {
    type: Object,
    default: () => ({})
  },
  pFamilyListener: {
    type: Boolean,
  },
  pEmitFamilyData: {
    type: Boolean,
    default: false,
  },
  pInternalization: {
    type: Object,
    default: () => ({
      conditionText: 'Solo se permiten letras.',
      conditionNumber: 'Solo se permiten números.',
      conditionMeasures: 'Solo se permiten números y puntos.',
      conditionEmail:
        'Por favor escriba un correo electrónico válido sin espacios.',
      errorLength: 'con una longitud minima de',
      errorLengthMax: 'y máximo',
      descripOptional: 'opcional',
      auxRequired: 'requerido',
      conditionId: 'Solo se permiten letras y números.',
      conditionAddress: 'Digite una dirección válida.',
    }),
  },
  pType: {
    type: String,
    default: 'text',
  },
  pPlaceholder: {
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
  pIsLimit: {
    type: Boolean,
    default: true,
  },
  pLength: {
    type: Object,
    default: () => ({
      min: 0,
      max: 50,
    }),
  },
  pIcons: {
    type: Object,
    default: () => ({
      error: `https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-error-25012022.svg`,
      arrow: `https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-arrow-26012022.svg`,
      miniLoader: `https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/Web_y-o_landing/basic/icons-animated/miniLoader--blue.svg`,
    }),
  },
  pIsRestrict: {
    type: Boolean,
    default: false,
  },
  pIsVerifying: {
    type: Boolean,
    default: false,
  },
  pIsStatusAfter: {
    type: Boolean,
    default: true,
  },
  pValue: null,
})
// events
const emits = defineEmits(['status', 'changeFamilyData', 'blur'])

// data
const show = ref(false);
const type = ref('text');
const typeField = ref('text');
const value = ref(props.pValue || '');
const tied = ref(null);
const required = ref(false);
const valueRaw = ref('');
const limit = reactive({
  isLimited: false,
  max: 0,
  min: 0,
});
const mask = {
  isMasked: false,
  pattern: '',
};
const state = reactive({
  length: 0,
  isFocused: false,
  isEmpty: true,
  isWarn: false,
  isError: false,
  isValid: false,
  verifying: false,
  errorMessage: '',
});
const condition = reactive({
  pattern: /^[a-zA-Z\s]+$/,
  isCondition: true,
  conditionMesaage: '',
  timeOut: setTimeout,
});

// methods
function changeType(type) {
  limit.max = props.pLength.max;
  limit.min = props.pLength.min;
  switch (type) {
    case 'text':
      condition.pattern =
        /^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-:]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionText;
      break;
    case 'phone':
      limit.min = 7;
      limit.max = 10;
      typeField.value = 'number';

    case 'number':
      // regex only numbers and spaces
      condition.pattern = /^[0-9\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionNumber;
      typeField.value = 'number';

      break;
    case 'measures':
      condition.pattern = /^[0-9.\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionMeasures;
      typeField.value = 'number';

      break;
    case 'email':
      limit.min = 7;
      limit.max = 250;
      typeField.value = 'email';
      condition.pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      condition.conditionMesaage = props.pInternalization.conditionEmail;
      break;
    case 'A': //NIT
      limit.min = 10;
      limit.max = 10;
      condition.pattern = /^[0-9.\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionNumber;
      break;
    case 'C': //CEDULA
      limit.min = 3;
      limit.max = 10;
      condition.pattern = /^[0-9.\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionNumber;
      break;
    case 'E': //CEDULA EXTRANJERIA
      limit.min = 1;
      limit.max = 11;
      condition.pattern = /^[a-zA-Z0-9\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionId;
      break;
    case 'P': //PASAPORTE
      limit.min = 1;
      limit.max = 11;
      condition.pattern = /^[a-zA-Z0-9\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionId;
      break;
    case 'R': //REGISTRO CIVIL
      limit.min = 8;
      limit.max = 16;
      condition.pattern = /^[a-zA-Z0-9\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionId;
      break;
    case 'T': //TARJ.IDENTIDAD
      limit.min = 10;
      limit.max = 14;
      condition.pattern = /^[0-9.\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionNumber;
      break;
    case 'D': //DIPLOMATICO
      limit.min = 1;
      limit.max = 11;
      condition.pattern = /^[a-zA-Z0-9\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionId;
      break;
    case 'N': //NUIP
      limit.min = 10;
      limit.max = 11;
      condition.pattern = /^[a-zA-Z0-9\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionId;
      break;
    case 'TE': //PERMISO ESPECIAL PERMANENCIA
      limit.min = 15;
      limit.max = 15;
      condition.pattern = /^[0-9.\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionNumber;
      break;
    case 'address':
      // regex address latam with #,- and spaces
      condition.pattern =
        /^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð #,.'-]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionAddress;
      break;
    case 'password':
      typeField.value = 'password';
      type.value = 'password';
      condition.pattern = /^[a-zA-Z0-9\s-+]+$/;
      condition.conditionMesaage = props.pInternalization.conditionText;
    default:
      // regex only letters, spaces AND NUMBERS
      condition.pattern = /^[a-zA-Z0-9\s]+$/u;
      condition.conditionMesaage = props.pInternalization.conditionId;
      break;
  }
};
function doThis(val) {
  state.isWarn = false;
  state.isValid = false;
  validateLength(val, validateType);
};
function validateLength(val, callback) {
  state.length = val.toString().length;

  if (state.length == 0) {
    state.isEmpty = true;
    state.isError = false;
    state.isWarn = false;
    state.errorMessage = '';
    state.verifying = false;
    clearTimeout(condition.timeOut);
    props.pIsStatusAfter ? '' : sendStatus(true);
    return;
  }
  state.isEmpty = false;
  if (props.pIsLimit) {
    if (
      state.length > limit.max ||
      state.length < limit.min
    ) {
      state.isWarn = true;
      state.errorMessage = `${condition.conditionMesaage} ${props.pInternalization.errorLength} ${limit.min} ${props.pInternalization.errorLengthMax} (${limit.max})`;
      props.pIsStatusAfter ? '' : sendStatus(true);
      return;
    } else {
      state.isWarn = false;
      state.errorMessage = '';
    }
    callback(val);
  }
};
function validateType(value) {
  // validate regex pattern
  switch (props.pType) {
    case 'email':
      clearTimeout(condition.timeOut);
      state.verifying = true;
      condition.timeOut = setTimeout(() => {
        state.verifying = false;
        if (!value.toLowerCase().match(condition.pattern)) {
          state.isError = true;
          state.errorMessage = condition.conditionMesaage;
        } else {
          state.isError = false;
          state.errorMessage = '';
          state.isValid = true;
          if (props.pEmitFamilyData) sendMsgToFamily();
        }
        props.pIsStatusAfter ? '' : sendStatus(true);
      }, 1400);
      break;
    default:
      if (!condition.pattern.test(value)) {
        state.isError = true;
        state.errorMessage = condition.conditionMesaage;
      } else {
        state.isError = false;
        state.errorMessage = '';
        if (props.pEmitFamilyData) sendMsgToFamily();
      }
      props.pIsStatusAfter ? '' : sendStatus(true);
      break;
  }
};
function sendStatus(val) {
  let state = {
    type: typeField.value,
    isEmpty: state.isEmpty,
    isError: state.isError,
    isRequired: required.value,
    name: props.pName,
    value: mask.isMasked ? valueRaw.value : value.value,
  };
  typeField.value == 'email' ? (state.isValid = state.isValid) : null;
  state.isWarn = required.value ? state.isEmpty : false;
  emits('status', state);
};
function sendMsgToFamily() {
  emits('changeFamilyData', {
    componentName: props.pName,
    data: value.value,
    condition: tied.value,
  });
};

// Lifecycle
onBeforeMount(() => {
  changeType(props.pType);
  if (props.pValue) {
    value.value = props.pValue;
  }
  if (props.pFamilyReceive.length > 0) {
    props.pFamilyReceive.forEach((item) => {
      if (item.change == 'visible') {
        show.value = false;
        required.value = false;
        return;
      } else {
        show.value = true;
        required.value = props.pIsRequired;
      }
    });
  } else {
    show.value = true;
    required.value = props.pIsRequired;
  }
  if (props.pIsLimit) {
    limit.max = props.pLength.max;
    limit.min = props.pLength.min;
  }
});

// computed
const classInput = computed(() => {
  return {
    'input-warn': state.isWarn && !state.isError,
    'input-error': state.isError,
  };
})
const placeholder = computed(() => {
  return (
    props.pPlaceholder + (required.value ? '*' : props.pInternalization.descripOptional)
  );
})

// watch
watch(value, (newVal, oldVal) => {
  doThis(newVal);

  if (props.pIsRestrict) {
    value.value = state.isError ? oldVal : newVal;
  }
})

watch(() => props.pIsVerifying, () => {
  if (props.pIsVerifying) sendStatus(props.pIsVerifying);
})

watch(() => props.pValue, (newVal) => {
  value.value = newVal;
})

watch(() => props.pFamilyListener, () => {
  if (props.pFamilyReceive.length > 0) {
    props.pFamilyReceive.forEach((item) => {
      // pFamilyData.components or lastComponent
      if (item.from == props.pFamilyData.lastComponent) {
        let components = props.pFamilyData.components.find(
          (comp) => comp.componentName == item.from
        );
        switch (item.change) {
          case 'type':
            changeType(components.data);
            doThis(value.value);
            break;
          case 'visible':
            if (components.condition == item.parameter) {
              state.isEmpty = false;
              show.value = true;
              required.value = props.pIsRequired;
            } else {
              show.value = false;
              required.value = false;
            }
            break;
          default:
            break;
        }
      }
    });
  }
})

</script>

<template>
  <div v-show="show" class="form-input_container">
  <transition name="slide-fade">
   <div v-show="!state.isEmpty" class="form-input_description">
     <span>
      {{ placeholder }}
     </span>
   </div>
  </transition>
    <div class="form-input_control">
      <input @blur="emits('blur')" v-model="value" v-bind:class="classInput" :type="type" :name="pName" class="form-input--sura" :required="required" :placeholder="placeholder">
   <div class="input-container-icon--md">
    <transition-group name="slide-up">
  <div key="1" class="icon-svg--error" v-show="state.verifying">
      <img :src="pIcons.miniLoader" alt="icon of verifying">
     </div>
     <div key="2" class="icon-svg--error" v-show="state.isError && !state.verifying">
      <img :src="pIcons.error" alt="icon of error">
     </div>
    </transition-group>
   </div>
 </div>
 <div v-show="pIsAux || state.isError || state.isWarn" class="form-input_auxiliary">
   <div class="row">
    <div class="col-10 position-relative">
     <transition-group name="slide-down">
      <span style="text-transform: capitalize;" class="position-absolute" :key="1" v-show="!state.isError && state.isEmpty">
       {{required ? pInternalization.auxRequired+'*' : pInternalization.descripOptional}}
      </span>
      <span :class="{'input_auxiliary--error': state.isError}" :key="2" v-show="!state.isEmpty">
       {{ state.isError || state.isWarn ? state.errorMessage  : condition.conditionMesaage }}
      </span>
     </transition-group>
     
    </div>
    <div v-if="pIsLimit" class="col-2 px-0 text-end">
     {{ state.length }}/{{ limit.max }}
    </div>
   </div>
    </div>
  </div>
</template>