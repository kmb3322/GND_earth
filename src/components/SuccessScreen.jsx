// =========================
//  SuccessScreen.jsx
// =========================
import { Button, Image, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const MotionButton = motion(Button);

const SuccessScreen = ({ name, ticketNo, isPaid, code }) => (
  <VStack spacing={10} align="center" mt={10}>
    <VStack spacing={6} width="100%" align="center">
      <Image
        src="/gnd_vol2.png"
        alt="GND2"
        boxSize={{ base: '280px', md: '450px' }}
        objectFit="contain"
        mt={-55}
        mb={{ base: '-20px', md: '-60px' }}
      />

      {code && (
            <Text
              fontFamily="mono"
              fontSize="14px"
              color="gray.700"
              textAlign="center"
              fontWeight={700}
              mt="6px"
            >
              Invite Code: <b>{code}</b>
            </Text>
          )}

      <Text fontFamily="noto" fontWeight="bold" fontSize="17px" textAlign="center">
        {name && `${name}님,`}
      </Text>

      <Text fontFamily="noto" fontWeight="bold" fontSize="17px" mt="-12px" textAlign="center">
        GND SEOUL vol.2에 초대되신 것을<br />환영합니다.
      </Text>

      

      {/* ───────────── 분기 ───────────── */}
      {isPaid ? (
        ticketNo && (
          <Text fontFamily="noto" fontSize="15px" mt="4px" textAlign="center">
            GND SEOUL vol.2 입장 번호는<br />
            <b>{ticketNo}</b>번입니다.<br /><br />
            입장 번호가 띄워진 본 화면을<br />당일 STAFF에게 보여주시면 됩니다.
          </Text>
        )
      ) : (
        <Text fontFamily="noto" fontSize="15px" mt="4px" textAlign="center">
          입금 확인이 완료되면,<br />
          당일 입장 가능한 번호가 제공됩니다.
        </Text>

      )}
    </VStack>

    {/* 메인 페이지로 돌아가기 */}
    <MotionButton
      key="back-home-btn"
      as={RouterLink}
      to="/"                         // 라우터 홈 경로
      fontFamily="noto"
      bg="#f2f2f2"
      color="#303030"
      border="2px solid #606060"
      borderRadius="full"
      px={5}
      py={4}
      fontSize="14px"
      fontWeight={500}
      boxShadow="0 4px 12px rgba(0,0,0,0.1)"
      _hover={{ bg: 'gray.100', transform: 'scale(1.03)' }}
      _active={{ bg: 'gray.200' }}
      mt={50}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
    >
      홈으로 돌아가기
    </MotionButton>

    <Text mb="20px"></Text>
  </VStack>
);

export default SuccessScreen;
