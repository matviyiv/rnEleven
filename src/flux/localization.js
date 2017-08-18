import {constants} from './actions';
import ua from '../localization/ua.json';
import en from '../localization/en.json';
const {
  SET_LAGUAGE,
  } = constants;
const initialState = {
  currentLocale: '',
  currentLocalization: null,
  ua: ua,
  en: en,
};
export function localization(state = initialState, action) {
  const actions = {
    [SET_LAGUAGE]: (st, {locale}) => {
      st.currentLocale = locale;
      st.currentLocalization =  st[locale];
      return { ...st };
    },
    default: (st) => st
  },
  modifier = actions[action.type] || actions.default;
  return modifier(state, action.data);
}