import { Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const EndScreen = ({ name }) => {
  return (
    <VStack spacing={10} align="center" mt={10}>
    <Image src="/gnd_image.png" mb={20} alt="GND vol.1" boxSize="250px" objectFit="contain" />
      <VStack spacing={6} width="100%" align="center">
      
        <Text fontFamily="noto" fontWeight="bold" fontSize="17px" mt="-12px" textAlign="center">
          GND vol.1 예매 기간이 종료 되었습니다.
        </Text>
        <Text fontFamily="noto" fontWeight="bold" fontSize="12px" mt="10px" textAlign="center">
          참가 코드를 사전에 입력하였지만 입금을 완료하지 않은 분들께서는
        </Text>
        <Text fontFamily="noto" fontWeight="bold" fontSize="12px" mt="-12px" textAlign="center">
          3333-25-4837088 카카오뱅크 정수빈 으로 ₩20,000원 입금 바랍니다.</Text>

          
        
      </VStack>

      
      <Text mb="20px"></Text>
    </VStack>
  );
};

export default EndScreen;
