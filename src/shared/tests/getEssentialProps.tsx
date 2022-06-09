export const getEssentialProps = (params: {} = {}) =>
  ({
    navigation: {
      goBack: jest.fn(),
    },
    route: {
      params: {
        ...params,
      },
    },
  } as any)
