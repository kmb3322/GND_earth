// src/App.jsx
import { Box, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//import EndScreen from './components/EndScreen';
//import HomeScreen from './components/HomeScreen';
import ArtistList from './components/ArtistList';
import ArtistPage from './components/ArtistPage';
import StartHomePage from './components/StartHomePage'; // 수정된 StartHomePage 컴포넌트 임포트
import TicketScreen from './components/ticketScreen';
import theme from './theme'; // 커스텀 테마 임포트

function App() {
  return (
    <ChakraProvider theme={theme}> {/* 테마 적용 */}
      <Box bg="#f0f0f0" minH="100vh" w="100%">
        <BrowserRouter>
          <Routes>
            <Route path='/'        element={<StartHomePage />} />
            <Route path='/ticket'  element={<TicketScreen />} />
            <Route path='/artists' element={<ArtistList />} />
            <Route path='/artist' element={<ArtistPage />} />
            <Route path='/artist/:id' element={<ArtistPage />} />
            
          </Routes>
      </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
}

export default App;
