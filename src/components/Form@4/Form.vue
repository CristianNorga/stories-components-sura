<script setup>
import './global.css'
import { reactive, defineProps, onMounted, computed  } from 'vue';
import axios from 'axios';


// props
const props = defineProps({
  pInternalization: {
    type: Object,
  },
  pGearId: {
    type: String,
    default: '',
  },
  pSmartcaptureFormId: {
    type: Number,
    default: 0,
  },
  pSourceKey: {
    type: String,
    default: '',
  },
  pSourceName: {
    type: String,
    default: '',
  },
  pSource: {
    type: String,
    default: 'dataExtension',
  },
  pTriggeredSend: {
    type: String,
    default: '',
  },
  pOnSubmitType: {
    type: String,
    default: '',
  },
  pOnSubmitGotoUrl: {
    type: String,
    default: '',
  },
  pCallback: {
    type: Function,
    default: () => {
      console.warn('callback not defined');
    },
  },
  pIsDataShared: {
    type: Boolean,
    default: false,
  },
  pDni: {
    type: Object,
    default: { id: 'id', typeId: 'typeId', necessary: true },
  },
  pLoader: {
    stype: String,
  },
  pIsGetIp: {
    type: Boolean,
    default: false,
  },
  pIsPost: {
    type: Boolean,
    default: true,
  },
  pAllowUpgrade: {
    type: Boolean,
    default: false,
  },
  pForeignKey: {
    type: String,
    default: '',
  },
});

// data
let internalization = {
  VERIFYING: 'Verificando...',
  ERROR: 'error encontrado',
  ERRORS: 'errores encontrados',
  SUBMITING: 'Enviando...',
  TEXTBTN: '¡ESTOY INTERESADO!',
  TYPESDOCS: {
    C: 'Cédula de ciudadanía',
    E: 'Cédula de extranjería',
    P: 'Pasaporte',
    TE: 'Permiso especial de permanencia',
    D: 'Diplomático',
    A: 'Nit',
    R: 'Registro civil',
    T: 'Tarjeta de identidad',
    N: 'Nuip',
  },
};

const state = reactive({
  verifying: false,
  counting: false,
  isError: false,
  submitted: false,
  porcentProgress: 0,
  inputs: [],
  timeOut: null,
  message: '',
});

const familyData = reactive({
  listener: false,
  lastComponent: '',
  components: [
    {
      componentName: 'nameInput',
      data: { id: 'id', typeId: 'typeId', necessary: true },
    },
  ],
});

const basicIcons = {
  error: `https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-error-25012022.svg`,
  arrow: `https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-arrow-26012022.svg`,
};

const persistence = reactive({
  isAxios: false,
  responseApi: null,
});

// methods
const changeFamilyData = (data) => {
  const componentIndex = familyData.components.findIndex((item) => item.componentName === data.componentName);

  if (componentIndex > -1) {
    familyData.components.splice(componentIndex, 1, data);
  } else {
    familyData.components.push(data);
  }
  familyData.listener = !familyData.listener;
  familyData.lastComponent = data.componentName;
};
const submit = () => {
  if (!state.isError) startVerify();
};
const startVerify = () => {
  state.inputs = [];
  state.verifying = true;
  state.message = internalization.VERIFYING;
  state.porcentProgress = 15;
};
const getStatus = (status) => {
  clearTimeout(state.timeOut);
  state.inputs.push(status);

  state.timeOut = setTimeout(() => {
    state.counting = true;
    state.porcentProgress = 30;
    readInputs();
  }, 2000);
};
const readInputs = () => {
  state.porcentProgress = 50;
  const problems = state.inputs.filter((item) => item.isError || (item.isRequired && item.isEmpty));

  if (problems.length > 0) {
    state.isError = true;
    state.porcentProgress = 100;

    if (problems.length === 1) {
      state.message = `${problems.length} ${internalization.ERROR}`;
    } else {
      state.message = `${problems.length} ${internalization.ERRORS}`;
    }

    state.timeOut = setTimeout(() => {
      state.porcentProgress = 0;
      state.verifying = false;
      state.counting = false;
      state.isError = false;
      state.message = '';
      state.inputs = [];
      clearTimeout(state.timeOut);
    }, 3000);
  } else {
    state.porcentProgress = 75;
    state.message = internalization.SUBMITING;

    state.timeOut = setTimeout(() => {
      if (!!props.pLoader) document.getElementById(props.pLoader).classList.add('show');

      const typeId = findInputs(props.pDni.typeId, 'name')?.value;

      if (props.pDni.necessary) {
        state.inputs.push({
          name: 'DNI',
          value: typeId + findInputs(props.pDni.id, 'name').value,
        });
      }

      changeInput(props.pDni.typeId, 'name', internalization.TYPESDOCS[typeId]);

      if (props.pIsGetIp) {
        getIpClient();
      } else {
        if (props.pIsPost) {
          post();
        } else {
          success();
        }
      }

      clearTimeout(state.timeOut);
    }, 1000);
  }
};
const getIpClient = async () => {
  if (persistence.isAxios) {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');

      if (response.data.ip) {
        state.inputs.push({
          name: 'IP',
          value: response.data.ip,
        });

        if (props.pIsPost) {
          post();
        } else {
          success();
        }
      }
    } catch (error) {
      error();
    }
  } else {
    persistence.isAxios = true;
    await window.libUtils.getScript(
      'axios',
      'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
      { async: false }
    );
    getIpClient();
  }
};
const findInputs = (value, key) => {
  return state.inputs.find((item) => item[key] == value);
};
const changeInput = (nameInput, key, value) => {
  for (let i = 0; i < state.inputs.length; i++) {
    const item = state.inputs[i];
    if (item[key] == nameInput) {
      item.value = value;
      break;
    }
  }
};
const addDataInLink = () => {
  let data = state.inputs.map((item) => {
    return `${item.name}=${encodeURIComponent(item.value)}`;
  });
  props.pOnSubmitGotoUrl = `${props.pOnSubmitGotoUrl}?${data.join('&')}`;
};
const apiSSJS = async (operation = 'read') => {
  let payload_anfi = window.libUtils.b64EncodeUnicode(
    JSON.stringify({
      filter: [props.pForeignKey],
      value: [findInputs(props.pForeignKey, 'name').value],
    })
  );

  let url_anfi = `https://seguros.comunicaciones.sura.com/ssjs-mdsf-2?pl=${payload_anfi}&de=${encodeURIComponent(
    props.pSourceName
  )}&tp=${operation}`;

  await window.libUtils.getScript('ssjsManager', url_anfi, { async: false });

  return verifyResult();
};
const verifyResult = () => {
  window.libUtils.deleteResource('ssjsManager');
  if (
    window.suraResult.error ||
    (window.suraResult.rowsAdd == undefined &&
      window.suraResult.response != 'null')
  ) {
    return 'errorServer';
  } else if (
    window.suraResult.rowsAdd == 0 ||
    window.suraResult.response == 'null'
  ) {
    return 'notFound';
  } else {
    return 'ok';
  }
};
const deleteRegister = () => {
  if (JSON.parse(window.suraResult.response).length > 1) return;
  apiSSJS('delete');
};
const searchRegister = async () => {
  let result_anfi = await apiSSJS();
  if (result_anfi == 'ok') deleteRegister();
};
const post = async () => {
  if (props.pAllowUpgrade) await searchRegister();

  await window.libUtils.getScript(
    'axios',
    'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
    { async: false }
  );

  let url = `${window.libUtils.getBaseUrl()}/smartcapture/post`;
  let attributes = [];
  var emailAddresses = [];
  let contentDetail = window.contentDetail || {};
  test = state.inputs;

  state.inputs.forEach((item) => {
    attributes.push(`"${item.name}":"${encodeURIComponent(item.value)}"`);
    if (item.type === 'email') {
      emailAddresses.push(`"${item.name}":"${item.value}"`);
    }
  });

  const payload = new URLSearchParams();
  payload.append('emailAddress', `{${emailAddresses.join(',')}}`);
  payload.append('formID', props.pSmartcaptureFormId);
  payload.append('targetID', props.pSourceKey);
  payload.append('targetType', props.pSource);
  payload.append('attributes', `{${attributes.join(',')}}`);
  payload.append('withTriggeredSend', props.pTriggeredSend);
  payload.append(
    'isJourneyBuilderIntegrated',
    !!contentDetail.triggerJourneyBuilderEvent
  );

  persistence.responseApi = null;

  persistence.responseApi = axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: ['application/json', 'text/javascript', '*/*; q=0.01'],
      'X-Requested-With': 'XMLHttpRequest',
    },
    data: payload,
  }).then((response) => {
    if (response.data === true && response.status === 200) {
      success();
    } else {
      error(response);
    }
  });
};
const success = () => {
  state.porcentProgress = 100;
  state.message = '✓';

  switch (props.pOnSubmitType) {
    case 'redirect':
      if (props.pIsDataShared) addDataInLink();
      window.location.href = props.pOnSubmitGotoUrl;
      break;
    case 'redirect-blank':
      if (props.pIsDataShared) addDataInLink();
      window.open(props.pOnSubmitGotoUrl, '_blank');
      break;
    case 'executeAction':
      props.pCallback(state.inputs);
      break;
    default:
      if (!!props.pLoader) document.getElementById(props.pLoader).classList.remove('show');
      state.submitted = true;
      break;
  }
};
const error = (x) => {
  window.alert(
    'Hubo un error al tratar de enviar los datos, por favor verifique todos los campos e intente nuevamente. Si el error persiste, por favor contacte al administrador del sitio. +57 312 5802861'
  );
  console.log(x);
};

// computeds
const classProgress = computed(() => ({
  'success-verificaton': state.submitted,
  'error-verificaton': state.isError,
}));

// life cycle
onMounted(() => {
  if (!props.pGearId) throw new Error('gearID is required');
  if (!props.pSmartcaptureFormId)
    console.warn('smartCaptureFormID is required for journey');
  if (!props.pSourceKey) throw new Error('sourceKey is required');
  if (!window.contentDetail)
    console.warn('contentDetail is required for the submit and tranking');
  if (!window.libUtils)
    console.warn('libUtils is required for get last upgrades.');
  if (
    props.pAllowUpgrade &&
    (!props.pSourceName || !props.pForeignKey)
  )
    console.error(
      'When updates are allowed, the pSourceName and pForeignKey are required'
    );
});
internalization = {
			...internalization,
			...props.pInternalization,
		};

</script>

<template>
  <div class="formSura">
   <transition name="slide-up">
   <form v-if="!state.submitted"  :id="'smartcapture-block-' + props.pGearId" class="smartcapture-content-wrapper container-fluid" novalidate="novalidate">
    <div class="row">

     <slot name="content" :verifying="state.verifying" :getStatus="getStatus" :changeFamilyData="changeFamilyData" :familyData="familyData" :familyListener="familyData.listener">
     
     </slot>
     
     <div class="col-12">
      <div class="form-input_button">
       <button :submited="state.submitted" type="button" @click="submit" :disabled="state.submitted">
        <progress :class="classProgress" id="progresa-form" max="100" :value="state.porcentProgress" class="progressForm"></progress>
        <span v-show="!state.verifying">{{internalization.TEXTBTN}}</span>
        <span v-show="state.verifying">{{ state.message }}</span>
       </button>
      </div>
     </div>

     <div class="col-12">
      <div class="form-input_button">
       <button id="send" type="submit" style="display:none;">
        ...
       </button>
      </div>
     </div>

    </div>
   </form>
   <div v-else-if="state.submitted" class="container-fluid">
    <div class="row">
     <slot name="tkcomponent">
     </slot>
    </div>
   </div>
   </transition>
  </div>
</template>
