import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Homepage from "./Homepage";
import CheckOrder from "./CheckOrder";
import colors from "../../components/colours"; // adjust the path as needed

const Tab = createBottomTabNavigator();

export default function HomepageLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.userTheme.primary,
        tabBarInactiveTintColor: colors.userTheme.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.userTheme.background,
          borderTopColor: "transparent",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Homepage") {
            iconName = "home";
          } else if (route.name === "Explore") {
            iconName = "search";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Homepage" component={Homepage} />
      <Tab.Screen name="Explore" component={CheckOrder} />
    </Tab.Navigator>
  );
}
