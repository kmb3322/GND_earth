import { Box, Button, Flex, Icon, Link, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import RegistrationForm from './RegistrationForm';

const HomeScreen = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) return <RegistrationForm />;

  return (
    <VStack spacing={10} align="center" mt={10}>
      {/* 애니메이션 로고 */}
      <Box
        as="video"
        src="/SADGASXGND_homepage.mp4"
        boxSize="500px"
        objectFit="contain"
        autoPlay
        loop
        muted
        playsInline
      />

    <Box w="100%" textAlign="center" mt="-100px" mb="50px">
      <Text
        color="gray.700"
        fontFamily="Galmuri11"
        fontSize="18px"
      >
        SAD GAS X GND
      </Text>
    </Box>
    <Box w="100%" textAlign="center" mt="-60px" mb="30px">
      <Text
        color="gray.700"
        fontFamily="Galmuri11"
        fontSize="15px"
      >
        05 24 25
      </Text>
    </Box>
      

      {/* 참가 버튼 */}
      <Button
        bg="black"
        color="white"
        fontFamily="mono"
        fontWeight="700"
        fontSize="16px"
        borderRadius="20px"
        px={8}
        py={6}
        boxShadow="0 0 10px 1px rgba(0,0,0,0.10)"
        _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
        _active={{ bg: 'gray.800' }}
        onClick={() => setShowForm(true)}
      >
        JOIN
      </Button>

      <Text color="gray.700" fontFamily="Galmuri11" fontSize="md" textAlign="center" mt="20px">
        서울 용산구 이태원로 173-7 REVENGE
      </Text>

      <Link href="https://instagram.com/gnd_earth" isExternal color="gray.600" mt={4}>
        <Flex align="center">
          <Icon as={FaInstagram} mr={1} />
          <Text>gnd_earth</Text>
        </Flex>
      </Link>

      <Link href="tel:010-8288-3951" _hover={{ textDecor: 'none' }}>
        <Text color="gray.500" fontFamily="noto" fontSize="10px" textAlign="center" mt="-10px">
          문의&nbsp;010-8288-3951
        </Text>
      </Link>

      <Text mb="100px" />
    </VStack>
  );
};

export default HomeScreen;
