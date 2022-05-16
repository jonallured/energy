import React from "react"
import { Flex, Button, Text, Join, Spacer } from "palette"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { graphql, useLazyLoadQuery } from "react-relay"
import { HomeUser } from "./HomeUser"
import { HomeQuery } from "__generated__/HomeQuery.graphql"
import { GlobalStore } from "store/GlobalStore"
import { ActivityIndicator } from "react-native"
import { MainNavigationStack } from "routes/MainNavigationStack"
import { HomeStackNavigator } from "routes/AuthenticatedNavigationStacks"
import { NavigationProp, useNavigation } from "@react-navigation/native"

export const Home: React.FC<{}> = ({}) => {
  const navigation = useNavigation<NavigationProp<HomeStackNavigator>>()

  const data = useLazyLoadQuery<HomeQuery>(
    graphql`
      query HomeQuery {
        me {
          ...HomeUser_me
        }
      }
    `,
    {}
  )

  if (!data?.me) {
    return <Text>Query Failed</Text>
  }
  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white" px={2}>
      <Join separator={<Spacer height={20} />}>
        <Button
          onPress={() => {
            navigation.navigate("Artists")
          }}
          block
        >
          Artists
        </Button>
        <Button
          onPress={() => {
            navigation.navigate("Albums")
          }}
          block
        >
          Albums
        </Button>
        <Button
          onPress={() => {
            navigation.navigate("Shows")
          }}
          block
        >
          Shows
        </Button>
      </Join>
    </Flex>
  )
}

export const HomeScreen: React.FC<{}> = () => {
  return (
    <React.Suspense
      fallback={() => (
        <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor={"white"}>
          <ActivityIndicator />
        </Flex>
      )}
    >
      <Home />
    </React.Suspense>
  )
}
