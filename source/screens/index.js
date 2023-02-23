import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./login";
import Home from "./home";
import Intro from "./intro";
import OTPScreen from "./otpScreen";
import VehicleRegisteration from "./vehicleRegisteration";
import AddVehicle from "./addVehicle";
import MyBooking from "./myBooking";
import RequestPassTab from "./requestPassTab";
import PassRequest from "./passRequest";
import FavouriteParking from "./favouriteParking";
import ContactUs from "./contactUs";
import ReferAFriend from "./referAFriend";
import ParkingDetail from "./parkingDetail";
import FindParking from "./findParking";
import BookingDetails from "./bookingDetails";
import BookingSummary from "./bookingSummary";
import BookingConfirmation from "./bookingConfirmation";
const Stack = createNativeStackNavigator();

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Intro"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
    </Stack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PassRequest" component={PassRequest} />
      <Stack.Screen name="AddVehicle" component={AddVehicle} />
      <Stack.Screen name="RequestPassTab" component={RequestPassTab} />
      <Stack.Screen name="MyBooking" component={MyBooking} />
      <Stack.Screen name="FavouriteParking" component={FavouriteParking} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="ReferAFriend" component={ReferAFriend} />
      <Stack.Screen name="ParkingDetail" component={ParkingDetail} />

      <Stack.Screen name="FindParking" component={FindParking} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="BookingSummary" component={BookingSummary} />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmation}
      />
      <Stack.Screen
        name="VehicleRegisteration"
        component={VehicleRegisteration}
      />
    </Stack.Navigator>
  );
}

export { AuthStackNavigator, AppStackNavigator };
