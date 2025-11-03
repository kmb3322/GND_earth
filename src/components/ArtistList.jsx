import {
    Box,
    Flex,
    Image,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);

export default function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/artists.json')
      .then((res) => res.json())
      .then((data) => {
        setArtists(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Flex w="100%" minH="100vh" align="center" justify="center" bg="#f0f0f0">
        <Text fontFamily="mono" fontSize="sm" color="gray.700">Loading...</Text>
      </Flex>
    );
  }

  return (
    <Box bg="#f0f0f0" minH="100vh" py={{ base: 12, md: 20, lg: 24 }} px={{ base: 4, md: 8, lg: 12, xl: 16 }}>
      {/* Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        mb={{ base: 12, md: 16, lg: 24 }}
      >
        <VStack spacing={{ base: 2, md: 3 }}>
          <RouterLink to="/">
            <Text
              fontFamily="mono"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="700"
              color="gray.800"
              letterSpacing="tight"
              _hover={{ opacity: 0.7 }}
              transition="opacity 0.2s"
            >
              GND EARTH
            </Text>
          </RouterLink>
          <Text
            fontFamily="mono"
            fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
            color="gray.600"
            fontWeight="400"
          >
            Artists
          </Text>
        </VStack>
      </MotionBox>

      {/* Artists Grid */}
      <Box w="100%">
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }}
          spacing={{ base: 6, md: 8, lg: 12, xl: 14 }}
        >
          {artists.map((artist, index) => (
            <MotionBox
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <RouterLink to={`/artist/${artist.id}`}>
                <VStack spacing={3} align="center">
                  {/* Profile Image */}
                  <Box
                    w="100%"
                    aspectRatio={1}
                    overflow="hidden"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    transition="all 0.3s"
                    _hover={{
                      borderColor: 'gray.800',
                      transform: 'scale(0.98)',
                    }}
                  >
                    <Image
                      src={artist.profile_image}
                      alt={artist.name_en}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      filter="grayscale(20%)"
                      transition="filter 0.3s"
                      _hover={{ filter: 'grayscale(0%)' }}
                    />
                  </Box>

                  {/* Artist Info */}
                  <VStack spacing={1} w="100%">
                    <Text
                      fontFamily="mono"
                      fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                      fontWeight="600"
                      color="gray.800"
                      textAlign="center"
                    >
                      {artist.name_kr}
                    </Text>
                    <Text
                      fontFamily="mono"
                      fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
                      color="gray.500"
                      fontStyle="italic"
                      textAlign="center"
                    >
                      {artist.name_en}
                    </Text>
                    <Text
                      fontFamily="mono"
                      fontSize={{ base: 'xs', md: 'sm' }}
                      color="gray.600"
                      textAlign="center"
                      mt={1}
                    >
                      {artist.title}
                    </Text>
                  </VStack>
                </VStack>
              </RouterLink>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>

      {/* Footer */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        textAlign="center"
        mt={{ base: 16, md: 24, lg: 32 }}
      >
        <Text fontFamily="mono" fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">
          © 2025 GND EARTH
        </Text>
      </MotionBox>
    </Box>
  );
}

