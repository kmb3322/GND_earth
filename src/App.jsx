// src/App.jsx
import { Box, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//import EndScreen from './components/EndScreen';
//import HomeScreen from './components/HomeScreen';
import StartHomePage from './components/StartHomePage';
import TicketScreen from './components/ticketScreen';
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
        <BrowserRouter>
          <Routes>
            <Route path='/'        element={<StartHomePage />} />
            <Route path='/ticket'  element={<TicketScreen />} />
            
          </Routes>
      </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
}

export default App;
