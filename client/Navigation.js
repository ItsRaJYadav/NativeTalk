import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from './screens/LandingPage';
import ChatScreen from './screens/Chat';
import LoginScreen from './screens/Login';
import { AuthContext } from './context/authorization';
import RegistrationScreen from './screens/Register';
import StatusScreen from './screens/Status';
import { useContext } from 'react';
import ProfileScreen from "./screens/Profile";
import AllUsersScreen from "./screens/AllUsers";
import ChatListScreen from "./screens/ChatList";
import UserProfileScreen from "./screens/UserProfile";
import AllRequestsScreen from "./screens/AllRequest";
import EditProfileScreen from "./screens/EditProfile";
const Stack = createNativeStackNavigator();

export default function App() {

    const [state] = useContext(AuthContext);
    const authorizedUser = state?.user && state?.token;

    return (
        <>

            <Stack.Navigator initialRouteName="LandingPage">
                {
                    authorizedUser ?
                        (<>

                            <Stack.Screen
                                name="Chatlist"
                                component={ChatListScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="AllUsers"
                                component={AllUsersScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Chat"
                                component={ChatScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Status"
                                component={StatusScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Profile"
                                component={ProfileScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="UserProfile"
                                component={UserProfileScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="AllRequests"
                                component={AllRequestsScreen}
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen
                                name="EditProfile"
                                component={EditProfileScreen}
                                options={{ headerShown: false }}
                            />


                        </>) :
                        (<>
                            <Stack.Screen
                                name="LandingPage"
                                component={LandingPage}
                                options={{ headerShown: false }}
                            />


                            <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                                options={{ headerShown: true }}
                            />
                            <Stack.Screen
                                name="Register"
                                component={RegistrationScreen}
                                options={{ headerShown: false }}
                            />
                        </>)
                }

            </Stack.Navigator>


        </>
    );
}


