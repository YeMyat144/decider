import * as React from 'react';
import { Provider as PaperProvider, Surface } from 'react-native-paper';
import DecisionMaker from '@/components/decision-maker'; 
export default function Home() {
  return (
    <PaperProvider>
      <DecisionMaker />
    </PaperProvider>
  );
}

