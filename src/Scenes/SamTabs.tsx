// @ts-nocheck
import React, { useState, useEffect, useRef } from "react"
import { StyleSheet, View, Text, Dimensions, Animated, PanResponder, Platform, StatusBar, Image } from "react-native"
import { TabView, TabBar, SceneRendererProps, NavigationState } from "react-native-tab-view"
import { Scene } from "react-native-tab-view/lib/typescript/types"
// import { Colors } from '../../colors';
// import { mockImages } from '../Profile/mockData';
// import { ProfileHeader } from '../Profile/ProfileHeader';

const windowHeight = Dimensions.get("window").height
const windowWidth = Dimensions.get("window").width
const TabBarHeight = 48
const HeaderHeight = 300
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
})

export const ProfileScreen = () => {
  /**
   * stats
   */
  const [tabIndex, setIndex] = useState(0)
  const [routes] = useState([
    { key: "tab1", title: "Posts" },
    { key: "tab2", title: "Only videos" },
  ])
  const [canScroll, setCanScroll] = useState(true)
  // const imageList = mockImages;

  /**
   * ref
   */
  const scrollY = useRef(new Animated.Value(0)).current
  const headerScrollY = useRef(new Animated.Value(0)).current
  const listRefArr = useRef([])
  const listOffset = useRef({})
  const isListGliding = useRef(false)
  const headerScrollStart = useRef(0)
  const _tabIndex = useRef(0)

  /**
   * PanResponder for header
   */
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation()
        syncScrollOffset()
        return false
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation()
        return Math.abs(gestureState.dy) > 5
      },

      onPanResponderRelease: (evt, gestureState) => {
        syncScrollOffset()
        if (Math.abs(gestureState.vy) < 0.2) {
          return
        }

        headerScrollY.setValue(scrollY._value)
        Animated.decay(headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          syncScrollOffset()
        })
      },
      onPanResponderMove: (evt, gestureState) => {
        listRefArr.current.forEach((item) => {
          if (item.key !== routes[_tabIndex.current].key) {
            return
          }
          if (item.value) {
            item.value.scrollToOffset({
              offset: -gestureState.dy + headerScrollStart.current,
              animated: false,
            })
          }
        })
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollStart.current = scrollY._value
      },
    })
  ).current

  /**
   * PanResponder for list in tab scene
   */
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation()
        return false
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation()
      },
    })
  ).current

  /**
   * effect
   */
  useEffect(() => {
    scrollY.addListener(({ value }) => {
      const curRoute = routes[tabIndex].key

      listOffset.current[curRoute] = value
    })

    headerScrollY.addListener(({ value }) => {
      listRefArr.current.forEach((item) => {
        if (item.key !== routes[tabIndex].key) {
          return
        }
        if (value > HeaderHeight || value < 0) {
          headerScrollY.stopAnimation()
          syncScrollOffset()
        }

        if (item.value && value <= HeaderHeight) {
          item.value.scrollToOffset({
            offset: value,
            animated: false,
          })
        }
      })
    })
    return () => {
      scrollY.removeAllListeners()
      headerScrollY.removeAllListeners()
    }
  }, [routes, tabIndex])

  /**
   *  helper functions
   */
  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex.current].key

    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            })
            listOffset.current[item.key] = scrollY._value
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (listOffset.current[item.key] < HeaderHeight || listOffset.current[item.key] == null) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              })
              listOffset.current[item.key] = HeaderHeight
            }
          }
        }
      }
    })
  }

  const onMomentumScrollBegin = () => {
    isListGliding.current = true
  }

  const onMomentumScrollEnd = () => {
    isListGliding.current = false
    syncScrollOffset()
  }

  const onScrollEndDrag = () => {
    syncScrollOffset()
  }

  /**
   * render Helper
   */
  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight],
      extrapolate: "clamp",
    })
    return (
      <Animated.View {...headerPanResponder.panHandlers} style={[styles.header, { transform: [{ translateY: y }] }]}>
        <ProfileHeader />
      </Animated.View>
    )
  }

  type TabItem = {
    item: {
      imageUrl: string
    }
    index: number
  }

  const rednerTab1Item = ({ item, index }: TabItem) => {
    return (
      <View
        style={[
          {
            width: windowWidth / 3,
            height: windowWidth / 3,
          },
          index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 },
        ]}
      >
        <Image
          style={styles.imageThumbnail}
          source={{
            uri: item.imageUrl,
          }}
        />
      </View>
    )
  }

  const rednerTab2Item = ({ item, index }: TabItem) => {
    return (
      <View
        style={[
          {
            width: windowWidth / 2,
            height: windowWidth / 1.5,
          },
          index % 2 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 },
        ]}
      >
        <Image
          style={styles.imageThumbnail}
          source={{
            uri: item.imageUrl,
          }}
        />
      </View>
    )
  }

  const renderLabel = ({
    route,
    focused,
  }: Scene<{
    key: string
    title: string
  }> & {
    focused: boolean
    color: string
  }) => {
    return <Text style={[styles.label, { opacity: focused ? 1 : 0.5 }]}>{route.title}</Text>
  }

  const renderScene = ({
    route,
  }: SceneRendererProps & {
    route: {
      key: string
      title: string
    }
  }) => {
    const focused = route.key === routes[tabIndex].key
    let numCols
    let data
    let renderItem
    switch (route.key) {
      case "tab1":
        numCols = 3
        data = imageList
        renderItem = rednerTab1Item
        break
      case "tab2":
        numCols = 2
        data = imageList
        renderItem = rednerTab2Item
        break
      default:
        return null
    }
    return (
      <Animated.FlatList
        scrollEnabled={canScroll}
        {...listPanResponder.panHandlers}
        numColumns={numCols}
        ref={(ref) => {
          if (ref) {
            const found = listRefArr.current.find((e) => e.key === route.key)
            if (!found) {
              listRefArr.current.push({
                key: route.key,
                value: ref,
              })
            }
          }
        }}
        scrollEventThrottle={16}
        onScroll={
          focused
            ? Animated.event(
                [
                  {
                    nativeEvent: { contentOffset: { y: scrollY } },
                  },
                ],
                { useNativeDriver: true }
              )
            : null
        }
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{
          paddingTop: HeaderHeight + TabBarHeight,
          minHeight: windowHeight - SafeStatusBar + HeaderHeight,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{
        key: string
        title: string
      }>
    }
  ) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 0],
      extrapolate: "clamp",
    })
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: "absolute",
          transform: [{ translateY: y }],
          width: "100%",
        }}
      >
        <TabBar
          {...props}
          onTabPress={({ route, preventDefault }) => {
            if (isListGliding.current) {
              preventDefault()
            }
          }}
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
        />
      </Animated.View>
    )
  }

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id
          setIndex(id)
        }}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: windowWidth,
        }}
      />
    )
  }

  return (
    <View style={styles.container}>
      {renderTabView()}
      {renderHeader()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HeaderHeight,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: Colors.white,
  },
  label: { fontSize: 16, color: Colors.secondary },
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: Colors.white,
    height: TabBarHeight,
  },
  indicator: { backgroundColor: Colors.secondary },
  imageThumbnail: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
})
