import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoginAdmin from './LoginAdmin';
import LoginUser from './LoginUser';

const Tab = createMaterialTopTabNavigator();

export default function AuthLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="LoginAdmin" component={LoginAdmin} />
      <Tab.Screen name="LoginUser" component={LoginUser} />
    </Tab.Navigator>
  );
}