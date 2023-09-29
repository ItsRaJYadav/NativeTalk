import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from './context/authorization';
import RootNavigation from './Navigation';
import {SocketContext, socket} from './context/SocketContext';

export default function App() {



  return (
    <>
     <SocketContext.Provider value={socket}>
      <AuthProvider>
        
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
       
        <StatusBar hidden={true} />
      </AuthProvider>
      </SocketContext.Provider>
    </>
  );
}


