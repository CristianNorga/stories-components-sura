<script setup>
import '../global.scss'
import { ref, reactive, watch, defineProps, defineEmits, onBeforeMount } from 'vue';

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
      descripOptional: 'opcional',
      auxRequired: 'requerido',
      placeholder: 'Seleccione una opción',
      optionOther: '¿Otro? (Especifique)',
      optionOther_callToWrite: 'Escribe aquí',
    }),
  },
  pConfigOther: {
    // pendiente, esta propiedad debe ser eliminada junto a participación
    type: Object,
    default: () => ({
      has: false,
      condition: null,
    }),
  },
  pIsMarginInSelection: {
    type: Boolean,
    default: false,
  },
  pPlaceholder: {
    type: String,
    default: '',
  },
  pIsOptionOther: {
    type: Boolean,
    default: false,
  },
  pName: {
    type: String,
    default: 'seleccionMultiple',
  },
  pIsRequired: {
    type: Boolean,
    default: false,
  },
  pIcons: {
    type: Object,
    default: () => ({
      error: 'https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-error-25012022.svg',
      arrow: 'https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-arrow-26012022.svg',
    }),
  },
  pIsSearch: {
    type: Boolean,
    default: false,
  },
  pItems: {
    type: Array,
    default: () => ([
      { value: 'item1', text: 'Item 1' },
      { value: 'item2', text: 'Item 2' },
      { value: 'item3', text: 'Item 3' },
    ]),
  },
  pIsVerifying: {
    type: Boolean,
    default: false,
  },
  pZIndex: {
    type: Number,
    default: 3,
  },
  pValue: null,
  pIsStatusAfter: {
    type: Boolean,
    default: true,
  },
  pType: {
    type: String,
    default: 'text',
  },
});

// events
const emits = defineEmits(['status', 'changeFamilyData']);

// data
const show = ref(false);
const required = ref(false);
const search = ref('');
const options = reactive({
  origin: props.pItems,
  filter: [],
  isOther: false,
  other: props.pInternalization.optionOther_callToWrite,
  selected: {
    value: '',
    text: '',
    tied: null,
  },
});
const state = reactive({
  isSelected: false,
  isFocused: false,
  isUnder: false,
  isWarn: false,
  isError: false,
  errorMessage: '',
});

// methods
const doThis = () => {
  state.isUnder = !state.isUnder;
  state.isWarn = false;
};
const selectOption = (event) => {
  options.isOther = false;
  options.selected.value = event.target.getAttribute('data-value');
  options.selected.text = event.target.innerText;
  options.selected.tied = event.target.getAttribute('data-tied') || null;
  state.isUnder = false;
  state.isSelected = true;

  if (props.pEmitFamilyData) sendMsgToFamily();

  props.pIsStatusAfter ? null : sendStatus(true);
};
const openOptionOther = () => {
  options.isOther = true;
  state.isUnder = false;
};
const closeOptionOther = () => {
  options.isOther = false;
};
const selectOptionOther = () => {
  if (!options.other) return;

  options.selected.value = options.other;
  options.selected.text = options.other;
  options.selected.tied = props.pConfigOther.has ? props.pConfigOther.condition : null;
  options.isOther = false;
  state.isSelected = true;
  options.other = props.pInternalization.optionOther_callToWrite;

  if (props.pEmitFamilyData) sendMsgToFamily();

  props.pIsStatusAfter ? null : sendStatus(true);
};
const removePlaceholderOther = () => {
  if (options.other === props.pInternalization.optionOther) {
    options.other = '';
  }
};
const loseFocus = () => {
  state.isUnder = false;
};
const sendStatus = (val) => {
  const stateObj = {
    type: props.pType,
    isEmpty: !state.isSelected,
    isError: state.isError,
    isRequired: props.pIsRequired,
    name: props.pName,
    value: options.selected.value,
  };

  state.isWarn = props.pIsRequired ? !state.isSelected : false;
  emits.status(stateObj);
};
const sendMsgToFamily = () => {
  emits.changeFamilyData({
    componentName: props.pName,
    data: options.selected.value,
    condition: options.selected.tied,
  });
};

// computed
const classInput = () => ({
  'input-warn': state.isWarn && !state.isError && !options.selected.value,
  'input-error': state.isError,
  'focus-select': state.isUnder,
  'option-default': !state.isSelected,
});
const classIconArrowSelect = () => ({
  'arrow-actived-select': state.isUnder,
});
const isMargin = () => ({
  marginBottom: state.isUnder && props.pIsMarginInSelection ? '165px' : '0px',
});

// watch
watch(search, () => {
  options.filter = options.origin
    .filter(item => {
      const decomposed = item.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return decomposed.indexOf(search.value.toLowerCase()) > -1;
    })
    .sort((a, b) => {
      return a.text.localeCompare(b.text);
    });
});
watch(() => props.pIsVerifying, (newVal) => {
  if (newVal) sendStatus(newVal);
});
watch(() => props.pValue, (newVal) => {
  if (newVal) {
    options.selected.value = newVal;
    options.selected.text = props.pItems.find(item => item.value === newVal);
    if (!options.selected.text) {
      options.selected.text = newVal;
    }
    options.selected.text = !options.selected.text ? newVal : options.selected.text.text;

    state.isUnder = false;
    state.isSelected = true;
  }
});

onBeforeMount(() => {
  options.filter = options.origin;
  options.selected.text = props.pPlaceholder || props.pInternalization.placeholder;

  if (props.pFamilyReceive.length > 0) {
    props.pFamilyReceive.forEach(item => {
      if (item.change === 'visible') {
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
  if (props.pValue) {
    options.selected.value = props.pValue;
    options.selected.text = props.pItems.find(item => item.value === props.pValue);
    options.selected.text = !options.selected.text ? props.pValue : options.selected.text.text;

    state.isUnder = false;
    state.isSelected = true;
  }
});

</script>

<template>
  <div v-show="show" class="form-input_container" @mouseleave="loseFocus" :style="isMargin">
    <transition name="slide-fade">
      <div v-show="state.isUnder || state.isSelected" class="form-input_description">
        <span>
          {{ pPlaceholder || pInternalization.placeholder }}
          <span v-if="pIsRequired">*</span>
          <span v-else> ({{ pInternalization.descripOptional }})</span>
        </span>
      </div>
    </transition> 
    <div class="form-input_control" :style="{'z-index': pZIndex}">
      <div @click="doThis" v-bind:class="classInput" class="form-select--sura">
        {{ options.selected.text }}
      </div>
      <div class="input-container-icon--xs">
        <transition name="slide-fade">
          <div class="icon-svg--arrow" v-bind:class="classIconArrowSelect">
            <img :src="pIcons.arrow" alt="icon arrow" @click="doThis" style="cursor: pointer;">
          </div>
        </transition>
      </div>
      <transition name="slide-fade-down">
        <div v-show="state.isUnder" class="input-container-items">
          <!-- input filter -->
          <div v-if="pIsSearch" class="input-container-filter">
            <input v-model="search" type="text" class="input-filter" placeholder="Buscar...">
          </div>
          <ul class="container-options">
            <li v-for="item in options.filter" :data-tied="item.condition" :data-value="item.value" class="select-option" @click="selectOption">
              {{ item.text }}
            </li>
            <li v-if="pIsOptionOther" @click="openOptionOther" :id="pName+'Other'" class="select-option option-other">
              {{ pInternalization.optionOther }}
            </li>
          </ul>
        </div>
      </transition>
      <input type="hidden" :name="pName" :value="options.selected.value">
    </div>
    <div v-show="pIsAux || state.isError" class="form-input_auxiliary">
      <div class="row">
        <div class="col-10 position-relative" style="text-transform: capitalize;">
          <transition-group name="slide-fade">
            <span style="position:absolute;" :key="1" v-show="pIsRequired && !state.isError && !state.isUnder && !state.isSelected">
              {{ pInternalization.auxRequired }}*
            </span>
            <span style="position:absolute;" :key="2" v-show="!pIsRequired && !state.isError && !state.isUnder && !state.isSelected">
              {{ pInternalization.descripOptional }}
            </span>
            <span :key="4" class="input_auxiliary--error" v-show="state.isError">
              {{ state.errorMessage }}
            </span>
          </transition-group>
        </div>
      </div>
    </div>
    <div v-show="options.isOther" class="form-input_control--other">
      <div class="form-input_description mt-1">
        <span>
          {{ pInternalization.optionOther }}
        </span>
      </div>
      <div :class="{'input-warn': state.isWarn && !state.isError }" class="mb-2 group-input--sura">
        <input type="text" class="form-input--sura" v-model="options.other" @click="removePlaceholderOther">
        <span @click="closeOptionOther">
          <button type="button" class="cancel">✖</button>
        </span>
        <span @click="selectOptionOther">
          <button type="button" class="confirm">✔</button>
        </span>
      </div>
    </div>
  </div>
</template>
