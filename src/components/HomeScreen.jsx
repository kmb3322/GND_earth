import { Flex, Icon, Image, Link, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import InputCode from './InputCode';

const HomeScreen = () => {
  return (
    <VStack spacing={10} align="center" mt={10}>
      <Image src="/gnd_image.png" alt="GND vol.1" boxSize="350px" objectFit="contain" />
      
      <Text fontFamily="UbuntuMono" fontSize="24px" fontWeight="bold" mb="-20px" mr="220px">GND</Text>

      <Text fontFamily="UbuntuMono" fontSize="20px" fontWeight="bold" mb="-20px">vol.1</Text>
      <Text fontFamily="UbuntuMono" fontSize="20px" fontWeight="bold" ml="220px">SEOUL</Text>

      <InputCode />
      
      <Text fontFamily="UbuntuMono" fontSize="md" textAlign="center" mt="20px">
        서울 마포구 독막로 7길 20 얼라이브홀<br />2025 01 03
      </Text>
      
      <Link href="https://instagram.com/gnd__earth" isExternal color="gray.600" mt={4}>
        <Flex align="center">
          <Icon as={FaInstagram} mr={1} />
          <Text>gnd__earth</Text>
        </Flex>
      </Link>

      <Text mb="100px"></Text>
    </VStack>
  );
};

export default HomeScreen;
