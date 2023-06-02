import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './constants/Routes';
import { useContext, useEffect, useState, useCallback } from 'react';


import Colors from './constants/Colors';

import SecondScreen from './screens/SecondScreen';
import FeedsContextProvider, { FeedsContext } from './state/context/feeds-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './components/CustomDrawer';
import { init } from './util/feedsDatabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconButton } from "@react-native-material/core";
import { init as initRead } from './util/readDb';
import Feed from './model/Feed';
import * as SplashScreen from 'expo-splash-screen';
import FirstScreen from './screens/FirstScreen';




const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const [loadingFeeds, setLoadingFeeds] = useState(true);
  const [appInitialized, setAppInitialized] = useState(false);
  const feedsCtx = useContext(FeedsContext)
  useEffect(() => {
    async function fetchHelper() {
      try {

        await init()
        await initRead()
        await feedsCtx.fetchFeeds()
        setLoadingFeeds(false)
      }
      catch (err) {
        console.log(`Error while loading feeds ${err}`)
      }

      finally {
        // Tell the application to render
        setAppInitialized(true)
      }
    }
    fetchHelper()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appInitialized) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      console.log("About to hide the splash screen!")
      await SplashScreen.hideAsync();
    }
  }, [appInitialized]);

  if (!appInitialized) {
    return null;
  }


  return (
    <View style={{flex:1}} onLayout={onLayoutRootView}>
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
          drawerActiveBackgroundColor: Colors.secondary500,
          drawerActiveTintColor: 'black',
          drawerInactiveTintColor: 'white',
          drawerInactiveBackgroundColor: Colors.primary800


        }}
        drawerType="front"
        drawerContent={props => <CustomDrawerContent {...props} />}
       

      >

        <Drawer.Screen name={"CNN Latest" + '-1'} initialParams={new Feed(-1, 'http://rss.cnn.com/rss/cnn_latest.rss', 'CNN Latest')}
          key={-1} component={FirstScreen} options={{
            title: "CNN Latest",
          }}
        />
        {
          feedsCtx.feeds.map(feed => {
            //console.log(feed.id)
            return <Drawer.Screen name={feed.name + feed.id} initialParams={feed}
              key={feed.id} component={FirstScreen} options={{
                title: feed.name, drawerIcon: ({ focused, size }) => (

                  <IconButton onPress={() => { feedsCtx.removeFeed(feed.id) }} style={{ position: 'absolute', right: 4, }} icon={props => <Ionicons name="trash" size={20} color={'red'} />}
                    color={Colors.primary500} />
                )
              }}
            />
          })
        }
      </Drawer.Navigator>
    </View>
  )
}

SplashScreen.preventAutoHideAsync();

export default function App() {


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

            <Stack.Screen name={Routes.secondScreen} component={SecondScreen} options={{ title: 'Article View' }} />
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
