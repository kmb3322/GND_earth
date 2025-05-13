// HomeScreen.jsx
import { Box, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import RegistrationForm from './RegistrationForm';
import SuccessScreen from './SuccessScreen';

export default function HomeScreen() {
  const [step, setStep] = useState('intro');   // 'intro' | 'form' | 'success'
  const [showButton, setShowButton] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  /* 3초 뒤 버튼 노출, 클릭/터치하면 즉시 노출 */
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 2500);
    return () => clearTimeout(timer);
  }, []);
  const handleTouch = () => !showButton && setShowButton(true);

  /* 공통 – 영상 위 ‘섬’ 오버레이 */
  const Overlay = ({ children }) => (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      bg="rgba(0,0,0,0.6)"        // 반투명 검은막
      backdropFilter="blur(10px)"  // 살짝 블러
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      zIndex={10}
    >
      <Box
      bg="9F9F9F"               // 카드도 다크 톤
      color="whiteAlpha.900"
      borderRadius="20px"
      w="100%"
      maxW="420px"
      maxH="90vh"
      overflowY="auto"
      boxShadow="0 0 20px rgba(0,0,0,0.6)"
      p={6}
      position="relative"
    >
      {children}
    </Box>
    </Box>
  );

  return (
    <Box position="relative" w="100%" h="100vh" bg="gray.900" overflow="hidden">
      {/* 배경 비디오 */}
      <video
        src="/posterpage.mp4"
        autoPlay
        loop
        muted
        playsInline
        onTouchStart={handleTouch}
        onClick={handleTouch}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          backgroundColor: '#1a1a1a',
        }}
      />

      {/* 참가하기 버튼 */}
      {showButton && step === 'intro' && (
        <Box
          position="absolute"
          top="68%"
          left="50%"
          transform="translate(-50%, -50%)"
          opacity={0}
          animation="fadeIn 1s forwards"
          sx={{ '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 0.9 } } }}
        >
          <Button
            borderRadius="10px"
            w="300px"
            px={8}
            py={6}
            mt={20}
            bg="rgb(160,13,13)"
            color="white"
            fontFamily="mono"
            fontWeight="700"
            fontSize="16px"
            letterSpacing={6}
            _hover={{ transform: 'scale(1.02)' }}
            onClick={() => setStep('form')}
          >
            참가하기
          </Button>
        </Box>
      )}

      {/* ===== 오버레이 단계 ===== */}
      {step === 'form' && (
        <Overlay>
          <RegistrationForm
            onSuccess={(name) => {
              setSubmittedName(name);
              setStep('success');
            }}
            onClose={() => setStep('intro')}
          />
        </Overlay>
      )}

      {step === 'success' && (
        <Overlay>
          <SuccessScreen name={submittedName} />
        </Overlay>
      )}
    </Box>
  );
}
