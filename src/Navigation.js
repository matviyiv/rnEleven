import { TabNavigator, TabBarBottom } from 'react-navigation';

import Home from './Home';
import Home2 from './Home2';

export const TabNavigation = TabNavigator({
  Home: {
    screen: Home,
  },
  Home2: {
    screen: Home2,
  },
}, {
  tabBarOptions: {
    tabBarComponent: TabBarBottom,
    activeTintColor: '#e91e63',
    swipeEnabled: true,
    animationEnabled: true,
  },
});
