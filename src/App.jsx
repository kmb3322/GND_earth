import { Box, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import HomeScreen from './components/HomeScreen';

function App() {
  return (
    <ChakraProvider>
      <Box bg="#f5f5f5" minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <HomeScreen />
      </Box>
    </ChakraProvider>
  );
}

export default App;
