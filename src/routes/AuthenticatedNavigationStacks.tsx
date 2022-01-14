import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { LinkingOptions, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AlbumsScreen } from "@Scenes/Albums/Albums"
import { ArtistScreen } from "@Scenes/Artist/Artist"
import { ArtistsScreen } from "@Scenes/Artists/Artists"
import { ArtworkScreen } from "@Scenes/Artwork/Artwork"
import { SelectPartnerScreen } from "@Scenes/SelectPartner/SelectPartner"
import { SettingsScreenStack } from "@Scenes/Settings/Settings"
import { ShowsScreen } from "@Scenes/Shows/Shows"
import { OrdersScreen } from "@Scenes/Orders/Orders"
import { ProfileScreen } from "@Scenes/Profile/Profile"
import { Button, Flex, useColor, useTheme } from "palette"
import React from "react"
import { GlobalStore } from "@store/GlobalStore"
import { HomeScreen } from "../Scenes/Home/Home"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SettingsIcon } from "../palette/svgs/SettingsIcon"

// tslint:disable-next-line:interface-over-type-literal
export type HomeStackNavigator = {
  Albums: undefined
  Artists: undefined
  Artist: { id: string }
  Artwork: { id: string }
  Home: undefined
  Shows: undefined
}

export const HomeStackNavigator = createStackNavigator<HomeStackNavigator>()

export const HomeStack = () => {
  return (
    <HomeStackNavigator.Navigator>
      <HomeStackNavigator.Screen name="Home" component={HomeScreen} />

      <HomeStackNavigator.Screen name="Artist" component={ArtistScreen} />
      <HomeStackNavigator.Screen name="Artists" component={ArtistsScreen} />
      <HomeStackNavigator.Screen name="Artwork" component={ArtworkScreen} />
      <HomeStackNavigator.Screen name="Shows" component={ShowsScreen} />
      <HomeStackNavigator.Screen name="Albums" component={AlbumsScreen} />
    </HomeStackNavigator.Navigator>
  )
}

// tslint:disable-next-line:interface-over-type-literal
export type TabNavigatorStack = {
  Home: undefined
  Orders: undefined
  Profile: undefined
  Settings: undefined
}

const Tab = createBottomTabNavigator<TabNavigatorStack>()

export const TabNavigatorStack = () => {
  const color = useColor()
  const {
    theme: { fonts },
  } = useTheme()

  const activeMode = GlobalStore.useAppState((state) => state.activeMode)

  const screenOptions: BottomTabNavigationOptions = {
    tabBarItemStyle: {
      alignItems: "center",
      justifyContent: "center",
    },
    tabBarIconStyle: { display: "none" },
    tabBarLabelStyle: {
      fontFamily: fonts.sans.medium,
      fontSize: 14,
    },
    tabBarActiveTintColor: color("blue100"),
    tabBarInactiveTintColor: color("black60"),
  }

  return (
    <Tab.Navigator
      screenOptions={() => {
        return screenOptions
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      {activeMode === "manager" && <Tab.Screen name="Orders" component={OrdersScreen} />}

      {activeMode === "manager" && (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation }) => {
            return {
              headerRight: () => (
                <Flex pr={1}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Settings")
                    }}
                  >
                    <SettingsIcon />
                  </TouchableOpacity>
                </Flex>
              ),
            }
          }}
        />
      )}
      {activeMode === "viewer" && (
        <Tab.Screen name="Settings" component={SettingsScreenStack} options={{ headerShown: false }} />
      )}
    </Tab.Navigator>
  )
}

// tslint:disable-next-line:interface-over-type-literal
export type MainAuthenticatedStackProps = {
  Settings: undefined
  TabNavigatorStack: undefined
  Artist: { id: string }
  Artwork: { id: string }
}

export const MainAuthenticatedStackNavigator = createStackNavigator<MainAuthenticatedStackProps>()

export const MainAuthenticatedStack = () => {
  return (
    <NavigationContainer>
      <MainAuthenticatedStackNavigator.Navigator>
        <MainAuthenticatedStackNavigator.Screen
          name="TabNavigatorStack"
          component={TabNavigatorStack}
          options={{ headerShown: false }}
        />
        <MainAuthenticatedStackNavigator.Screen
          name="Settings"
          component={SettingsScreenStack}
          options={{ headerShown: false }}
        />
      </MainAuthenticatedStackNavigator.Navigator>
    </NavigationContainer>
  )
}

export const AuthenticatedStack = () => {
  const selectedPartner = GlobalStore.useAppState((state) => state.activePartnerID)

  if (!selectedPartner) {
    return <SelectPartnerScreen />
  }

  return <MainAuthenticatedStack />
}
