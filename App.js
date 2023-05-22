import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './constants/Routes';
import { useContext, useEffect, useState } from 'react';


import Colors from './constants/Colors';
import FirstScreen from './screens/FirstScreen';
import SecondScreen from './screens/SecondScreen';
import FeedsContextProvider, { FeedsContext } from './state/context/feeds-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './components/CustomDrawer';
import { init } from './util/feedsDatabase';
import AppLoading from 'expo-app-loading';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconButton } from "@react-native-material/core";
import { init as initRead } from './util/readDb';




const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const [loadingFeeds, setLoadingFeeds] = useState(true);
  const feedsCtx = useContext(FeedsContext)
  useEffect(() => {
    async function fetchHelper() {
      try {
        await feedsCtx.fetchFeeds()
        setLoadingFeeds(false)
      }
      catch (err) {
        console.log(`Error while loading feeds ${err}`)
      }
    }
    fetchHelper()
  }, [])


  if (loadingFeeds)
    return <AppLoading />
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleStyle: {
          color: Colors.secondary500
        },
        headerTintColor: 'white',
        drawerContentStyle: {

        }
        ,
        sceneContainerStyle: {
          backgroundColor: Colors.primary500
        },


        navigationBarColor: Colors.primary800,


        headerStyle: {
          backgroundColor: Colors.primary800,

        },

      }}
      drawerType="front"
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: Colors.secondary500,
        itemStyle: { marginVertical: 10 },
      }}

    >
      {

        feedsCtx.feeds.map(feed => {

          return <Drawer.Screen name={feed.name + feed.id} initialParams={feed}
            key={feed.id} component={FirstScreen} options={{
              title: feed.name, drawerIcon: ({ focused, size }) => (

                <IconButton onPress={() => { feedsCtx.removeFeed(feed.id) }} style={{ position: 'absolute', right: 4 }} icon={props => <Ionicons name="trash" size={20} />}
                  color={Colors.primary500} />
              )
            }}
          />
        })
      }
    </Drawer.Navigator>
  )
}

export default function App() {

  const [dbInitialized, setDbInitialized] = useState(false);
  LogBox.ignoreAllLogs(true)
  useEffect(() => {

    async function fetchAndInitialize() {
      try {
        await init()
        await initRead()

        setDbInitialized(true)
      }
      catch (err) {
        console.log(`Could not initialize db or fetch feeds... error: ${err}`)
      }
    }

    fetchAndInitialize()


  }, [])

  if (!dbInitialized)
    return <AppLoading />

  return (
    <>
      <StatusBar style="light" />
      <FeedsContextProvider>
        <NavigationContainer>

          <Stack.Navigator screenOptions={{
            headerTitleStyle: {
              color: Colors.secondary500
            },
            headerTintColor: 'white',
            contentStyle: {
              backgroundColor: Colors.primary500,


            },

            navigationBarColor: Colors.primary800,

            presentation: 'modal',
            headerStyle: {
              backgroundColor: Colors.primary800,

            },

          }}>
            <Stack.Screen name={Routes.drawerNavigator} component={DrawerNavigator} options={{ headerShown: false, headerTintColor: Colors.secondary500, navigationBarColor: Colors.primary800, }} />

            <Stack.Screen name={Routes.secondScreen} component={SecondScreen} options={{ title: 'Second Screen' }} />
          </Stack.Navigator>


        </NavigationContainer>
      </FeedsContextProvider>

    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
