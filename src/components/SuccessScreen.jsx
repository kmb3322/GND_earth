// =========================
//  SuccessScreen.jsx
// =========================
import { AspectRatio, Box, Button, Image, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const SuccessScreen = ({ name, ticketNo, isPaid }) => (
  <Box
    bg="#f0f0f0"
    minH="100vh"
    position="relative"
    overflowX="hidden"
    w="100%"
  >
    {/* 상단 로고 */}
    <Box
      as={RouterLink}
      to="/"
      position="absolute"
      top={{ base: "20px", md: "30px" }}
      left="50%"
      transform="translateX(-50%)"
    >
      <Image
        src="/logo.png"
        alt="logo"
        width={{ base: "15px", md: "20px" }}
        cursor="pointer"
        transition="all 0.3s"
        _hover={{ opacity: 0.8, transform: 'scale(0.98)' }}
      />
    </Box>

    <VStack
      spacing={0}
      align="center"
      justify="center"
      minH="100vh"
      py={8}
      w="100%"
    >
      {/* 비디오 애니메이션 */}
      <AspectRatio
        ratio={1}
        w={{ base: '200px', md: '280px' }}
        bg="#f0f0f0"
        borderRadius="md"
        overflow="hidden"
      >
        <Box
          as="video"
          src="/gnd_ani.mp4"
          autoPlay
          loop
          muted
          playsInline
          objectFit="cover"
          w="100%"
          h="100%"
          sx={{
            maskImage:
              'radial-gradient(circle at center, black 75%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black 75%, transparent 100%)',
          }}
        />
      </AspectRatio>

      {/* 환영 메시지 */}
      <VStack spacing={2} mt={4} align="center">
        <Text
          fontFamily="noto"
          fontWeight="700"
          fontSize={{ base: "16px", md: "18px" }}
          color="gray.800"
          textAlign="center"
        >
          {name && `${name}님,`}
        </Text>

        <Text
          fontFamily="noto"
          fontWeight="700"
          fontSize={{ base: "16px", md: "18px" }}
          color="gray.800"
          textAlign="center"
        >
          C&C: SHOW CASE에 초대되신 것을<br />환영합니다.
        </Text>
      </VStack>

      {/* 입장 정보 */}
      <VStack spacing={2} mt={6} align="center">
        {isPaid ? (
          ticketNo && (
            <Text
              fontFamily="noto"
              fontSize={{ base: "14px", md: "15px" }}
              color="gray.700"
              textAlign="center"
              lineHeight="1.8"
            >
              입장 번호는 <Text as="span" fontWeight="700" fontSize={{ base: "18px", md: "20px" }}>{parseInt(ticketNo) * 3 + 40}</Text>번입니다.<br /><br />
              입장 번호가 띄워진 본 화면을<br />당일 STAFF에게 보여주시면 됩니다.
            </Text>
          )
        ) : (
          <Text
            fontFamily="noto"
            fontSize={{ base: "14px", md: "15px" }}
            color="gray.700"
            textAlign="center"
            lineHeight="1.8"
          >
            입금 확인이 완료되면,<br />
            당일 입장 가능한 번호가 제공됩니다.
          </Text>
        )}
      </VStack>

      {/* 홈으로 돌아가기 버튼 */}
      <Button
        as={RouterLink}
        to="/"
        mt={10}
        bg="black"
        color="white"
        borderRadius="20px"
        fontFamily="unica"
        fontWeight="700"
        fontSize="14px"
        px={8}
        py={5}
        _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
        transition="all 0.2s"
      >
        HOME
      </Button>
    </VStack>
  </Box>
);

export default SuccessScreen;
