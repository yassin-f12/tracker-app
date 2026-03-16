import { StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import { Tabs } from 'expo-router'
import CustomTabs from '@/components/CustomTabs'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

const renderTabBar = (props: BottomTabBarProps) => <CustomTabs {...props} />

const _layout = () => {
  return (
    <Tabs tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name='index' />
      <Tabs.Screen name='statistics' />
      <Tabs.Screen name='wallet' />
      <Tabs.Screen name='profile' />
    </Tabs>
  )
}

export default _layout