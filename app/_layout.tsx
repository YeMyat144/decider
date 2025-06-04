"use client"

import * as React from "react"
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper"
import DecisionMaker from "@/components/decision-maker"

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
    <PaperProvider theme={theme}>
      <DecisionMaker />
    </PaperProvider>
  )
}
