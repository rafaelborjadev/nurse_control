import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Login from './src/components/Login/Login';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Login />
        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
