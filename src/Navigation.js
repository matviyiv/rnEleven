import { TabNavigator, TabBarBottom } from 'react-navigation';

import Main from './containers/main/Main';
import Whywe from './containers/whywe/Whywe';

export const TabNavigation = TabNavigator({
  Main: {
    screen: Main,
  },
  Whywe: {
    screen: Whywe,
  },
}, {
  tabBarOptions: {
    tabBarComponent: TabBarBottom,
    activeTintColor: '#e91e63',
    swipeEnabled: true,
    animationEnabled: true,
  },
});
