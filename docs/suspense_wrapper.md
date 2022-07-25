# Suspense Wrapper

We use suspense to display a loading indicator while fetching the data.
On a broad level, App.js is using the suspense wrapper.

However on Components that use

```
<TabsContainer>
  <Tabs.Tab>
    <Screen1/>
  </Tabs.Tab>
  <Tabs.Tab>
    <Screen2/>
  </Tabs.Tab>
</TabsContainer>
```

we need to explicitly wrap components in a <SuspenseWrapper withTabs> so it would be:

```
<TabsContainer>
  <Tabs.Tab>
    <SuspenseWrapper withTabs>
      <Screen1/>
    </SuspenseWrapper>
  </Tabs.Tab>
  <Tabs.Tab>
    <SuspenseWrapper withTabs>
      <Screen2/>
    </SuspenseWrapper>
  </Tabs.Tab>
</TabsContainer>
```
