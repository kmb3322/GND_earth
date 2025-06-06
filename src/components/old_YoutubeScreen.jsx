import { AspectRatio, Flex, Icon, Image, Link, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const YoutubeScreen = () => {
  return (
    <VStack spacing={10} align="center" mt={10}>
      {/* 사진은 모든 디바이스에서 일정한 크기로 (예: 400px) 표시 */}
      <Image
        mb={10}
        src="/gnd_image.png"
        alt="GND vol.1"
        width="200px"
      />

      {/* 유튜브 영상은 모바일에서는 80vw, 데스크탑(md 이상)에서는 40vw 크기로 표시 */}
      <AspectRatio
        width={{ base: "100vw", md: "40vw" }}
        ratio={16 / 9}
        mb={10}
      >
        <iframe
          src="https://www.youtube.com/embed/Db1onQoAIXU?autoplay=1&mute=0&controls=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </AspectRatio>

      <Link href="https://instagram.com/gnd_earth" isExternal color="gray.600" mt={4}>
        <Flex align="center">
          <Icon as={FaInstagram} mr={1} />
          <Text>gnd_earth</Text>
        </Flex>
      </Link>

      <Link href="tel:010-8288-3951" textDecoration="none">
        <Text
          color="gray.500"
          fontFamily="noto"
          fontSize="10px"
          textAlign="center"
          mt="-10px"
        >
          문의 010-8288-3951
        </Text>
      </Link>

      <Text mb="100px" />
    </VStack>
  );
};

export default YoutubeScreen;
