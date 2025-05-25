import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Homepage from './Homepage';
import CheckOrder from './CheckOrder';

const Tab = createBottomTabNavigator();

export default function HomepageLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Homepage" component={Homepage} />
      <Tab.Screen name="CheckOrder" component={CheckOrder} />
    </Tab.Navigator>
  );
}