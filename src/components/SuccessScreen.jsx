// =========================
//  SuccessScreen.jsx
// =========================
import { Box, Button, Image, Text, VStack } from '@chakra-ui/react';
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
      zIndex={10}
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

    {/* 이벤트 정보 로고 - logo.png와 ENTRY NUMBER 사이 */}
    {isPaid && ticketNo && (
      <VStack
        spacing={0}
        align="flex-start"
        position="absolute"
        top={{ base: "80px", md: "100px" }}
        left="50%"
        transform="translateX(-50%)"
      >
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize={{ base: "12px", md: "18px" }}
        >
          C&C: SHOW CASE
        </Text>
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize={{ base: "12px", md: "18px" }}
        >
          PRESENTED BY GND
        </Text>
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize={{ base: "12px", md: "18px" }}
        >
          2026 02 22
        </Text>
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize={{ base: "12px", md: "18px" }}
        >
          HONEY CLOVER SEOUL
        </Text>
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize={{ base: "12px", md: "18px" }}
        >
          7, YONSEI-RO 7-AN-GIL, SEODAEMUN-GU
        </Text>
      </VStack>
    )}

    {/* 메인 콘텐츠 - 화면 중앙 */}
    <VStack
      spacing={0}
      align="center"
      justify="center"
      minH="100vh"
      py={8}
      w="100%"
    >
      <VStack spacing={4} align="center">
        {isPaid ? (
          ticketNo && (
            <VStack spacing={3} align="center">
              

              {/* 번호 */}
              <Text
                fontFamily="unica"
                fontWeight="700"
                fontSize="50px"
                color="gray.800"
                lineHeight="1"
                mt={-1}
              >
                {parseInt(ticketNo) * 3 + 40}
              </Text>
              

              {/* 안내 문구 */}
              <VStack spacing={3} align="center" mt={4}>
                {/* 입장 확인 완료 */}
                <VStack spacing={1} align="center">
                  <Text
                    fontFamily="noto"
                    fontSize={{ base: "13px", md: "14px" }}
                    color="gray.700"
                    textAlign="center"
                    fontWeight="500"
                  >
                    예매 확인이 완료되었습니다.
                  </Text>
                  <Text
                    fontFamily="unica"
                    fontWeight="400"
                    fontSize={{ base: "10px", md: "11px" }}
                    color="gray.500"
                    textAlign="center"
                    letterSpacing="0.03em"
                  >
                    Your reservation has been confirmed.
                  </Text>
                </VStack>

                {/* 안내 */}
                <VStack spacing={1} align="center" mt={2}>
                  <Text
                    fontFamily="noto"
                    fontSize={{ base: "12px", md: "13px" }}
                    color="gray.500"
                    textAlign="center"
                    lineHeight="1.8"
                  >
                    입장 번호가 띄워진 본 화면을<br />입장시 당일 STAFF에게 보여주시기 바랍니다.
                  </Text>
                  <Text
                    fontFamily="unica"
                    fontWeight="400"
                    fontSize={{ base: "10px", md: "11px" }}
                    color="gray.400"
                    textAlign="center"
                    letterSpacing="0.03em"
                    mt={1}
                  >
                    Please show this screen to STAFF upon entry.
                  </Text>
                </VStack>
              </VStack>
            </VStack>
          )
        ) : (
          <VStack spacing={2} align="center">
            <Text
              fontFamily="noto"
              fontSize={{ base: "13px", md: "14px" }}
              color="gray.600"
              textAlign="center"
              lineHeight="1.8"
            >
              입금 확인이 완료되면,<br />
              당일 입장 가능한 번호가 제공됩니다.
            </Text>
            <Text
              fontFamily="unica"
              fontWeight="400"
              fontSize={{ base: "10px", md: "11px" }}
              color="gray.400"
              textAlign="center"
              letterSpacing="0.03em"
              mt={1}
            >
              Your entry number will be provided<br />once payment is confirmed.
            </Text>
          </VStack>
        )}
      </VStack>
    </VStack>

    {/* 홈으로 돌아가기 버튼 - 하단 중앙 */}
    <Button
      as={RouterLink}
      to="/"
      position="absolute"
      bottom={{ base: "40px", md: "50px" }}
      left="50%"
      transform="translateX(-50%)"
      bg="#f0f0f0"
      color="#303030"
      border="2px solid #606060"
      borderRadius="full"
      fontFamily="noto"
      fontWeight="500"
      fontSize="14px"
      px={5}
      py={4}
      boxShadow="0 4px 12px rgba(0,0,0,0.1)"
      _hover={{ bg: '#f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      _focus={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', outline: 'none' }}
      _focusVisible={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', outline: 'none' }}
      _active={{ bg: '#f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      HOME
    </Button>
  </Box>
);

export default SuccessScreen;
