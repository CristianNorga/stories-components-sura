import Switch from './Switch.vue';

export default {
  title: 'Form/Switch',
  component: Switch,
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
