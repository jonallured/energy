declare module "@react-native-community/netinfo/jest/netinfo-mock.js" {
  const mockRNCNetInfo: {
    addEventListener: jest.Mock
    removeEventListener: jest.Mock
    fetch: jest.Mock
  }

  export default mockRNCNetInfo
}
