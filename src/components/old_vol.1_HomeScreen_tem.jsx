import { Flex, Icon, Link, Text, VStack } from '@chakra-ui/react';
import { FaInstagram } from 'react-icons/fa';
import InputCode from './old_vol.1_InputCode';

const HomeScreen = () => {
  return (
    <VStack spacing={10} align="center" mt={10}>
      
      <Text color="gray.700" fontFamily="mono" fontSize="18px" fontWeight="bold" mb="-20px" mr="220px">GND</Text>

      <Text color="gray.700" fontFamily="mono" fontSize="16px" fontWeight="bold" mb="-20px">vol.1</Text>
      <Text color="gray.700" fontFamily="mono" fontSize="16px" fontWeight="bold" mb="100px" ml="220px">SEOUL</Text>

      
      
      <Text color="gray.700" fontFamily="mono" fontSize="md" fontWeight="bold" textAlign="center" mt="20px">
        2025 07 12
      </Text>

      <InputCode />
      
      <Link href="https://instagram.com/gnd_earth" isExternal color="gray.600" mt={4}>
        <Flex align="center">
          <Icon as={FaInstagram} mr={1} />
          <Text>gnd_earth</Text>
        </Flex>
      </Link>
      <Link href="tel:010-8288-3951" textDecoration="none">
          <Text color="gray.500" fontFamily="noto" fontSize="10px" textAlign="center" mt="-10px">
            문의 010-8288-3951
          </Text>
        </Link>
      <Text mb="100px"></Text>
    </VStack>
  );
};

export default HomeScreen;
