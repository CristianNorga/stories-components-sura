import Checkbox from './Checkbox.vue';

export default {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    
  },
};

export const Default = {
  args: {
    pValue: 'Si',
    pName: '',
    pIsRequired: false,
    pIsCheck: false,
    pSideLabel: 'left',
    pIsVerifying: false,
    pIsStatusAfter: true,
  }
};