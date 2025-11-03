import {
    Box,
    Link as ChakraLink,
    Divider,
    Flex,
    HStack,
    Image,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionText = motion(Text);

function getYoutubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.replace('/', '');
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || '';
    return '';
  } catch {
    return '';
  }
}

const CHAEDOBIN_VIDEOS = [
  { title: 'Transparent Luv (Live)', url: 'https://youtu.be/2Tk9M4C8VNQ' },
  { title: 'No Pressure (Performance Ver.)', url: 'https://youtu.be/sM7c7Pstk3c' },
  { title: 'Roommate Housing Vol.1', url: 'https://youtu.be/Bx-PJGxH1Jc' },
];

export default function ArtistPage() {
  const { id: idFromPath } = useParams();
  const [searchParams] = useSearchParams();
  const idFromQuery = searchParams.get('id');

  const artistId = idFromPath || idFromQuery || 'chaedobin';

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/data/artists.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load artists');
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setArtists(Array.isArray(json) ? json : []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const artist = useMemo(() => {
    if (!artists.length) return null;
    const found = artists.find((a) => a.id === artistId);
    return found || artists[0];
  }, [artists, artistId]);

  if (loading) {
    return (
      <Flex w="100%" minH="100vh" align="center" justify="center" bg="#f0f0f0">
        <Text fontFamily="mono" fontSize="sm" color="gray.700">Loading...</Text>
      </Flex>
    );
  }

  if (error || !artist) {
    return (
      <Flex w="100%" minH="100vh" direction="column" align="center" justify="center" gap={4} bg="#f0f0f0">
        <Text fontFamily="mono" fontSize="lg">Error</Text>
        <Text fontFamily="mono" fontSize="sm" color="gray.600">{error || 'Data not found'}</Text>
        <ChakraLink
          as={RouterLink}
          to="/artists"
          fontFamily="mono"
          fontSize="sm"
          textDecoration="underline"
          _hover={{ color: 'gray.800' }}
        >
          ← Back to Artists
        </ChakraLink>
      </Flex>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    artist.social?.instagram || ''
  )}`;

  const videos = artist.id === 'chaedobin' ? CHAEDOBIN_VIDEOS : [];

  return (
    <Box bg="#f0f0f0" color="gray.800" minH="100vh" fontFamily="mono" pb={16}>
      {/* HEADER */}
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        bg="#f0f0f0"
        borderBottom="1px solid"
        borderColor="gray.300"
        px={{ base: 4, md: 8, lg: 12, xl: 16 }}
        py={{ base: 3, md: 4 }}
      >
        <Flex align="center" justify="space-between" w="100%">
          <HStack spacing={4}>
            <ChakraLink as={RouterLink} to="/artists" _hover={{ opacity: 0.7 }}>
              <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" letterSpacing="wider" textTransform="lowercase" color="gray.600">← artists</Text>
            </ChakraLink>
          </HStack>
          <HStack spacing={{ base: 4, md: 8, lg: 10 }} fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color="gray.600">
            <ChakraLink href="#info" _hover={{ textDecoration: 'underline' }} textTransform="lowercase">info</ChakraLink>
            <ChakraLink href="#works" _hover={{ textDecoration: 'underline' }} textTransform="lowercase">works</ChakraLink>
            <ChakraLink href="#contact" _hover={{ textDecoration: 'underline' }} textTransform="lowercase">contact</ChakraLink>
          </HStack>
        </Flex>
      </Box>

      <Box h={14} />

      {/* HERO / INFO */}
      <MotionBox
        id="info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        px={{ base: 4, md: 8, lg: 12, xl: 16 }}
        pt={{ base: 8, md: 16, lg: 20 }}
        pb={{ base: 12, md: 20, lg: 24 }}
      >
        <VStack spacing={{ base: 10, md: 12, lg: 14 }} align="stretch">
          {/* Title */}
          <Box textAlign="left">
            <MotionText
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="700"
              mb={{ base: 2, md: 3 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {artist.name_kr}
            </MotionText>
            <MotionText
              fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
              fontStyle="italic"
              color="gray.600"
              fontWeight="400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {artist.name_en}
            </MotionText>
          </Box>

          <Divider borderColor="gray.400" />

          {/* Profile image */}
          <Flex justify="center">
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Image
                src={artist.profile_image}
                alt={artist.name_en}
                maxW={{ base: '250px', md: '300px', lg: '350px' }}
                border="1px solid"
                borderColor="gray.300"
                objectFit="cover"
              />
            </MotionBox>
          </Flex>

          {/* Bio grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, lg: 10 }} pt={{ base: 4, lg: 6 }}>
            <Box>
              <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" mb={2} letterSpacing="wider" color="gray.600">ORGANIZATION</Text>
              <Text fontSize={{ base: 'sm', md: 'md' }}>{artist.organization}</Text>
            </Box>
            <Box>
              <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" mb={2} letterSpacing="wider" color="gray.600">TITLE</Text>
              <Text fontSize={{ base: 'sm', md: 'md' }}>{artist.title}</Text>
            </Box>
            <Box gridColumn={{ base: '1', md: '1 / -1' }}>
              <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" mb={2} letterSpacing="wider" color="gray.600">BIO</Text>
              <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} lineHeight="1.8">{artist.bio}</Text>
            </Box>
          </SimpleGrid>

          <Divider borderColor="gray.400" />

          {/* Links */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <HStack spacing={{ base: 6, md: 8 }}>
              {artist.social?.instagram && (
                <ChakraLink href={artist.social.instagram} isExternal fontSize={{ base: 'xs', md: 'sm' }} _hover={{ textDecoration: 'underline' }}>
                  Instagram ↗
                </ChakraLink>
              )}
              {artist.social?.soundcloud && (
                <ChakraLink href={artist.social.soundcloud} isExternal fontSize={{ base: 'xs', md: 'sm' }} _hover={{ textDecoration: 'underline' }}>
                  SoundCloud ↗
                </ChakraLink>
              )}
              {artist.social?.youtube && (
                <ChakraLink href={artist.social.youtube} isExternal fontSize={{ base: 'xs', md: 'sm' }} _hover={{ textDecoration: 'underline' }}>
                  YouTube ↗
                </ChakraLink>
              )}
            </HStack>
            <Image src={qrUrl} alt="QR" w={{ base: '60px', md: '80px' }} h={{ base: '60px', md: '80px' }} border="1px solid" borderColor="gray.300" />
          </Flex>
        </VStack>
      </MotionBox>

      {/* WORKS */}
      {videos.length > 0 && (
        <MotionBox
          id="works"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          px={{ base: 4, md: 8, lg: 12, xl: 16 }}
          pb={{ base: 16, lg: 20 }}
        >
          <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" mb={{ base: 6, md: 8 }} letterSpacing="wider" color="gray.600">SELECTED WORKS</Text>
          <VStack spacing={{ base: 6, md: 8 }} align="stretch">
            {videos.map((v, i) => {
              const vid = getYoutubeId(v.url);
              const thumb = vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : '/logo.png';
              return (
                <MotionBox
                  key={v.url}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <ChakraLink href={v.url} isExternal _hover={{ opacity: 0.7 }} display="block">
                    <Flex 
                      gap={{ base: 4, md: 6 }} 
                      align="center" 
                      border="1px solid" 
                      borderColor="gray.300" 
                      p={{ base: 4, md: 6 }} 
                      bg="white"
                      _hover={{ borderColor: 'gray.800' }} 
                      transition="all 0.2s"
                    >
                      <Image 
                        src={thumb} 
                        alt={v.title} 
                        w={{ base: '100px', md: '140px', lg: '180px' }} 
                        h={{ base: '75px', md: '105px', lg: '135px' }} 
                        objectFit="cover" 
                        border="1px solid" 
                        borderColor="gray.300" 
                      />
                      <Box flex="1">
                        <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} fontWeight="600">{v.title}</Text>
                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600" mt={1}>Watch ↗</Text>
                      </Box>
                    </Flex>
                  </ChakraLink>
                </MotionBox>
              );
            })}
          </VStack>
        </MotionBox>
      )}

      {/* CONTACT */}
      <MotionBox
        id="contact"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        px={{ base: 4, md: 8, lg: 12, xl: 16 }}
        pb={{ base: 16, lg: 20 }}
        textAlign="center"
      >
        <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" mb={4} letterSpacing="wider" color="gray.600">COLLABORATION & CONTACT</Text>
        <Text fontSize={{ base: 'sm', md: 'md' }} mb={6} color="gray.600">
          For collaboration inquiries, please use the form below.
        </Text>
        <ChakraLink
          href={`https://gndearth.org/contact?artist=${artist.id}`}
          isExternal
          fontSize={{ base: 'xs', md: 'sm' }}
          textDecoration="underline"
          _hover={{ color: 'gray.800' }}
        >
          Contact Form ↗
        </ChakraLink>
      </MotionBox>

      {/* FOOTER */}
      <MotionBox
        as="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        textAlign="center"
        fontSize={{ base: 'xs', md: 'sm' }}
        color="gray.500"
        pt={{ base: 8, md: 10 }}
        borderTop="1px solid"
        borderColor="gray.300"
        mx={{ base: 4, md: 8, lg: 12, xl: 16 }}
      >
        <Text>GND Verified Artist</Text>
        <Text mt={1} fontSize={{ base: '2xs', md: 'xs' }} fontStyle="italic">© 2025 GND EARTH</Text>
      </MotionBox>
    </Box>
  );
}
