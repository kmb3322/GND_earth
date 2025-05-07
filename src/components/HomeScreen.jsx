import { Box, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import RegistrationForm from './RegistrationForm';

const HomeScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTouch = () => {
    if (!showButton) {
      setShowButton(true);
    }
  };

  if (showForm) return <RegistrationForm />;

  return (
    <Box
      position="relative"
      width="100%"
      height="100vh"
      overflow="hidden"
      bg="gray.900"
    >
      {/* 인트로 비디오 */}
      <video
        src="/Poster_홈페이지용.mp4"
        autoPlay
        loop
        muted
        playsInline
        onTouchStart={handleTouch}
        onClick={handleTouch}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', // 전체 비율 유지
          objectPosition: 'center',
          backgroundColor: '#1a1a1a' // 여백 배경 어두운 회색
        }}
        mb={20}
      />



      {/* 버튼 */}
      {showButton && (
        <Box
          position="absolute"
          top="68%"
          left="50%"
          transform="translate(-50%, -50%)"
          opacity={0}
          animation="fadeIn 1s forwards"
          sx={{
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 0.7 },
            },
          }}
        >
          <Button
            borderRadius="10px"
            width="300px"
            mt={-18}
            px={8}
            py={6}
            bg="rgb(160, 13, 13)"
            color="white"
            fontFamily="mono"
            fontWeight="700"
            fontSize="16px"
            boxShadow="0 0 10px 1px rgba(0,0,0,0.10)"
            _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
            _active={{ bg: 'gray.800' }}
            onClick={() => setShowForm(true)}
            letterSpacing={6}
          >
            참가하기
          </Button>
        </Box>
      )}

      
    </Box>
  );
};

export default HomeScreen;
