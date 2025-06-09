"use client"

import DecisionMaker from "@/components/decision-maker"
import * as React from "react"
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper"

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#008080",
    accent: "#ff7f50",
  },
}

export default function Home() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <DecisionMaker />
      </PaperProvider>
    </GestureHandlerRootView>
  )
}
