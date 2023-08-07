import Input from './Input.vue';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
export default {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    pType: {
      control: {
        type: 'select',
      },
      options: ['text', 'email', 'phone', 'number', 'measures', 'email', 'A', 'C', 'E', 'P', 'R', 'T', 'D', 'N','TE', 'address', 'password'],
    },
  },
};

export const Default = {
  args: {
    pIsAux: true,
    pFamilyReceive: [],
    pFamilyData: {},
    pFamilyListener: false,
    pEmitFamilyData: false,
    pInternalization: {
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
    },
    pType: 'text',
    pPlaceholder: '',
    pName: '',
    pIsRequired: false,
    pIsLimit: true,
    pLength: {
      min: 0,
      max: 50,
    },
    pIcons: {
      error: `https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-error-25012022.svg`,
      arrow: `https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/icon-arrow-26012022.svg`,
      miniLoader: `https://comunicaciones.segurossura.com.co/MercadeoPersonas/recursos/Web_y-o_landing/basic/icons-animated/miniLoader--blue.svg`,
    },
    pIsRestrict: false,
    pIsVerifying: false,
    pIsStatusAfter: true,
    pValue: null,
  }
};

export const Email = {
  args: {
    pType: 'email',
    pLength: {
      min: 4,
      max: 254,
    },
  }
}