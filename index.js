import { registerRootComponent } from 'expo';
import AppMobile from './src/mobile/AppMobile';

// registerRootComponent calls AppRegistry.registerComponent('main', () => AppMobile);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppMobile);
