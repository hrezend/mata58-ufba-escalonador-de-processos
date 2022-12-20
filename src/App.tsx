import React from 'react';
import { AppRoutes } from './routes';
import { ChakraProvider } from '@chakra-ui/react';

export function App(){
  return(
    <ChakraProvider>
      <AppRoutes />
    </ChakraProvider>
  );
}
