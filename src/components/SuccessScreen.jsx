// src/components/SuccessScreen.jsx
import { Text, VStack } from '@chakra-ui/react';
import React from 'react';

const SuccessScreen = () => {
  return (
    <VStack spacing={10} align="center" mt={10}>

      <VStack spacing={6} width="100%" align="center">
        <Text fontFamily="UbuntuMono" fontWeight="bold" fontSize="lg" textAlign="center">
          3333-25-4837088 카카오뱅크 정수빈
        </Text>
        <Text fontFamily="UbuntuMono" fontWeight="bold" fontSize="lg"  textAlign="center">
          25,000원 입금 후, GND vol.1에 참가하실 수 있습니다.</Text>

          <Text fontFamily="UbuntuMono" fontSize="lg"  textAlign="center">
          웹페이지에 입력하신 이름과 동일하게 입금자명 표기 부탁드립니다.</Text>
          
        
        <Text fontFamily="UbuntuMono" fontSize="lg" textAlign="center">
          입금이 확인된 뒤 입력하신 전화번호로 GND vol.1 세부 안내 문자가 발송될 예정입니다.
        </Text>
      </VStack>

      
      <Text mb="100px"></Text>
    </VStack>
  );
};

export default SuccessScreen;
