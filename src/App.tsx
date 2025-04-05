/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { Provider } from 'react-redux';
import { rootStore } from './state/rootStore';
import { SafeAreaView, useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PokedexScreen } from './view/PokedexScreen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { createStaticNavigation } from '@react-navigation/native';
import { PokemonScreen } from './view/PokemonScreen';

function App(): React.JSX.Element {

  const createRootStack = () => {
    const isDarkMode = useColorScheme() === 'dark'
    return createNativeStackNavigator({
      screenOptions: {
        headerStyle: {
          backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
        },
        headerTitleStyle: {
          color: isDarkMode ? Colors.lighter : Colors.darker
        }
      },
      screens: {
        'Pokedex': {
          screen: PokedexScreen,
          option: {
            title: 'Pokedex'
          }
        },
        'Pokemon': {
          screen: PokemonScreen,
          option: {
            title: 'Pokemon'
          }
        }
      }
    })
  }

  const Navigation = createStaticNavigation(createRootStack())

  return (
    <Provider store={rootStore}>
      <Navigation/>
    </Provider>
  );
}

export default App;
