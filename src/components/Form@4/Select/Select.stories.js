import Select from './Select.vue';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
export default {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    pType: {
      control: {
        type: 'select',
      },
      options: ['text'],
    },
  },
};

export const Default = {
  args: {
    pIsAux: true,
    pFamilyReceve: [],
    pFamilyData: {},
    pFamilyListener: false,
    pEmitFmilyData: false,
    pInternaization: { 
      descripOpal: 'opcional',
      auxRequired: 'requerido',
      placeholder: 'Seleccione una opción',
      optionOther: '¿Otro? (Especifique)',
      optionOther_callToWrite: 'Escribe aquí',
    },
    pConfigOther: {
      has: false,
      condition: null,
    },
    pIsMarinInSelection: false,
    pPlceholder: '',
    pIsOptonOther: false,
    pName: 'seleccionMultiple',
    pIsReqired: false,
    pIcons: {
      error: 'https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-error-25012022.svg',
      arrow: 'https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-arrow-26012022.svg',
    },
    pIsSeach: false,
    pItems: [
      { value: 'item1', text: 'Item 1' },
      { value: 'item2', text: 'Item 2' },
      { value: 'item3', text: 'Item 3' },
    ],
    pIsVerfying: false,
    pZndex: 3,
    pValue: null,
    pIsSttusAfter: true,
    pType: 'text',
  },
};