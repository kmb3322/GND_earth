// src/App.jsx
import { Box, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
//import EndScreen from './components/EndScreen';
//import HomeScreen from './components/HomeScreen';
import YoutubeScreen from './components/YoutubeScreen';
import theme from './theme'; // 커스텀 테마 임포트

function App() {
  return (
    <ChakraProvider theme={theme}> {/* 테마 적용 */}
      <Box
        bg="#f5f5f5"
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <YoutubeScreen />
      </Box>
    </ChakraProvider>
  );
}

export default App;
