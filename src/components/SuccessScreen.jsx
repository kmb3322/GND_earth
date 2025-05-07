// =========================
//  SuccessScreen.jsx
// =========================
import { Text, VStack } from '@chakra-ui/react';
import React from 'react';

const SuccessScreen = ({ name }) => (
  <VStack spacing={10} align="center" mt={10}>
    <VStack spacing={6} width="100%" align="center">
      <Text
        fontFamily="noto"
        fontWeight="bold"
        fontSize="17px"
        textAlign="center"
      >
        {name}님,
      </Text>

      <Text
        fontFamily="noto"
        fontWeight="bold"
        fontSize="17px"
        mt="-12px"
        textAlign="center"
      >
        SAD GAS X GND에 오신 것을 환영합니다.
      </Text>

      <Text
        fontFamily="noto"
        fontSize="12px"
        mt="10px"
        textAlign="center"
      >
        입금 확인 후 세부 안내가 문자로 발송될 예정입니다.
      </Text>
    </VStack>

    <Text mb="20px"></Text>
  </VStack>
);

export default SuccessScreen;
