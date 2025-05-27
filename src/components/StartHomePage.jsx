import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  AspectRatio, Box, Button, Flex, Grid, Icon, Link, Text, VStack,
} from '@chakra-ui/react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const MotionText   = motion(Text);
const MotionBox    = motion(Box);
const MotionButton = motion(Button);          // ← 추가

export default function StartHomePage() {
  const [showTicket, setShowTicket] = useState(false);

  /* ────────────── 티켓 버튼 자동·수동 노출 ────────────── */
  useEffect(() => {
    const id = setTimeout(() => setShowTicket(true), 500);
    return () => clearTimeout(id);
  }, []);
  const reveal = () => setShowTicket(true);

  /* ────────────── 스크롤 진행 표시 ────────────── */
  const infoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });

  /* ────────────── 콘텐츠 ────────────── */
  const missionLines = [
    'GND는 젊은 아티스트들이 자신을 알리고 성장할 수 있는 발판을 마련하고자 하는 취지에서 출발하였습니다.',
    'GND는 높은 잠재력을 지닌 다양한 분야(미술, 음악, 무용 등)의 아티스트들을 한자리에 모시고, 보다 큰 무대를 제공하고자 합니다.',
    '여러 작가와 창작자들이 함께 작업하는 과정에서 얻게 되는 지식과 아이디어의 교류는 개인의 역량을 확장할 뿐 아니라, 예술 생태계 전반의 성장에도 크게 기여할 수 있습니다.',
    'GND는 나아가 아티스트들이 서로의 작품 세계를 공유하고 자유롭게 논의할 수 있는 네트워킹 장을 구축하여, 기존에 없던 협업과 창작의 기회를 창출하는 것을 목표로 하고 있습니다.',
  ];

  const people = [
    {
      name: '정수빈',
      role: '기획총괄 및 대표',
      desc: ['KAIST 산업디자인학과 23학번', 'KAIST 공식학생홍보대사 카이누리 18기', 'KAIST 입학처 주관 창글리 캠프 기획·운영 (2023.07.31, 2024.01.22, 2024.01.29, 2024.07.29, 2025.01.20)'],
    },
    {
      name: '채도빈',
      role: '공연 총괄',
      desc: ["22.7.16 EP 'BREAK THE MINOR' 데뷔 (YunB, leebido 참여)","2025 이탈리아 밀라노 MilanloveSeoul 초청 아티스트", "THE TOUR BUS' 기획 총괄 (관객 150명 참여)"],
    },
    {
      name: '김민범',
      role: '영상 총괄 · 홈페이지 개발',
      desc: ['KAIST 전산학부 23학번', 'KAIST HCI 연구실 KIXLAB 인턴', '제37회 대학 축제 태울뮤직페스티벌 총감독', 'KAIST 방송국 VOK 소속 활동, 학교 홍보 영상 · 신입생 환영 영상 제작', '전국 단위 단편영화제 다수 수상'],
    },
  ];

  /* ────────────── 애니메이션 Variant ────────────── */
  const fadeVariant = {
    hidden:  { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.15 },
    }),
  };

  return (
    <Box bg="#F2F2F2" minH="100vh" position="relative" overflowX="hidden">
      {/* 상단 스크롤 바 */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: 3,
          background: '#000',
          width: barWidth,
          zIndex: 999,
        }}
      />

      {/* ───── Hero ───── */}
      <MotionBox
        as={Flex}
        position="relative" 
        direction="column"
        justify="center"
        align="center"
        minH="100vh"
        textAlign="center"
        bgSize="cover"
        bgPosition="center"
        style={{ backgroundAttachment: 'fixed' }}
        initial={{ backgroundPositionY: 0 }}
        animate={{ backgroundPositionY: ['0%', '20%'] }}
        transition={{ ease: 'linear', duration: 20, repeat: Infinity }}
        onClick={reveal}
        onTouchStart={reveal}
      >
        {/* 로고 */}
        <Text color="gray.700" fontFamily="mono" fontSize="18px" fontWeight="bold" mb="40px" mr="220px">
          SADGAS
        </Text>
        <Text color="gray.700" fontFamily="mono" fontSize="16px" fontWeight="bold" mb="40px">
          X
        </Text>
        <Text color="gray.700" fontFamily="mono" fontSize="16px" fontWeight="bold" ml="220px" mb="60px">
          GND
        </Text>

        {/* 날짜 */}
        <Text mt={20} mb={50} color="gray.700" fontFamily="mono" fontWeight={500} fontSize="14px">
          2025&nbsp;06&nbsp;14
        </Text>

        {/* 참가하기 버튼 : AnimatePresence 로 부드럽게 fade-in */}
        <AnimatePresence>
          {showTicket && (
            <MotionButton
            position="absolute"
              key="ticket-btn"
              as={RouterLink}
              to="/ticket"
              fontFamily="mono"
              bg="black"
              color="white"
              fontSize="16px"
              fontWeight={500}
              borderRadius="full"
              px={10}
              py={6}
              boxShadow="0 4px 12px rgba(0,0,0,0.25)"
              _hover={{ bg: 'gray.700', transform: 'scale(1.03)' }}
              _active={{ bg: 'gray.800' }}
              bottom="20%"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              참가하기
            </MotionButton>
          )}
        </AnimatePresence>

        {/* 아래로 스크롤 버튼 */}
        <MotionButton
            position="absolute"
          bottom="10%"
          variant="ghost"
          onClick={() => scrollTo(infoRef)}
          _hover={{ transform: 'translateY(2px)' }}
          _active={{ transform: 'translateY(4px)' }}
          aria-label="scroll"

          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Icon as={ChevronDownIcon} w={10} h={10} />
        </MotionButton>
      </MotionBox>

      {/* ───── Video ───── */}
      <Box
        pt={20}
        pb={10}
        bg="#F5F5F5"
        bgGradient="linear(to-b,#F5F5F5 0%,rgba(245,245,245,0) 100%)"
      >
        <VStack spacing={2} maxW="900px" mx="auto" px={20}>
          <AspectRatio width={{ base: '100vw', md: '80vw' }} ratio={16 / 9}>
            <iframe
              src="https://www.youtube.com/embed/Db1onQoAIXU?autoplay=1&mute=1&playsinline=1&controls=1&loop=1&playlist=Db1onQoAIXU"
              title="YouTube video player"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </AspectRatio>
        </VStack>
      </Box>

      {/* ───── Mission ───── */}
      <Box
        ref={infoRef}
        pt={20}
        pb={40}
        bgGradient="linear(to-b,rgba(242,242,242,0) 0%,#F2F2F2 100%)"
      >
        <VStack spacing={6} maxW="900px" mx="auto" px={4}>
          <Text
            fontFamily="'Ubuntu Mono', monospace"
            fontSize="28px"
            fontWeight="700"
            alignSelf="flex-start"
          >
            GND EARTH
          </Text>

          {missionLines.map((line, i) => (
            <MotionText
              key={i}
              fontFamily="'Ubuntu Mono', monospace"
              fontSize={{ base: '14px', md: '16px' }}
              fontWeight={i < 1 ? '700' : '400'}
              textAlign="center"
              lineHeight="1.8"
              variants={fadeVariant}
              initial="hidden"
              whileInView="visible"
              custom={i}
              viewport={{ once: true, margin: '-80px' }}
            >
              {line}
            </MotionText>
          ))}

          {/* ───── People ───── */}
          <MotionBox
            w="full"
            pt={10}
            variants={fadeVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={6}
              w="full"
            >
              {people.map((p, i) => (
                <MotionBox
                  key={p.name}
                  p={5}
                  borderRadius="lg"
                  bg="rgba(255,255,255,0.25)"
                  border="1px solid rgba(255,255,255,0.4)"
                  backdropFilter="blur(6px)"
                  shadow="lg"
                  whileHover={{ rotateX: 5, rotateY: -5, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  variants={fadeVariant}
                  initial="hidden"
                  whileInView="visible"
                  custom={i}
                  viewport={{ once: true, margin: '-80px' }}
                >
                  <Text fontWeight="700" mb={0} fontFamily={"noto"}>
                    {p.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={2} fontFamily={"noto"}>
                    {p.role}
                  </Text>
                  <VStack align="flex-start" spacing={1}>
                    {p.desc.map((d, idx) => (
                      <Text key={idx} fontSize="xs" color="gray.600" fontFamily={"noto"}>
                        •&nbsp;{d}
                      </Text>
                    ))}
                  </VStack>
                </MotionBox>
              ))}
            </Grid>
          </MotionBox>
        </VStack>
      </Box>

      {/* ───── Footer ───── */}
      <VStack py={10} spacing={2}>
        
        <Link href="https://instagram.com/gnd_earth" isExternal>
          <Flex align="center" color="gray.500">
            <Icon as={FaInstagram} mr={1} />
            <Text color="gray.600" fontFamily="noto" fontSize="10px" textAlign="center" >@gnd_earth</Text>
          </Flex>
        </Link>
        <Link href="https://youtube.com/@gndearth" isExternal>
          <Flex align="center" color="gray.500">
            <Icon as={FaYoutube} mr={1} />
            <Text color="gray.600" fontFamily="noto" fontSize="10px" textAlign="center">
              youtube.com/@gndearth
            </Text>
          </Flex>
        </Link>
        <Link href="tel:010-8288-3951" textDecoration="none">
                  <Text color="gray.600" fontFamily="noto" fontSize="10px" textAlign="center" mt="0px">
                    문의 010-8288-3951
                  </Text>
                </Link>
      </VStack>
    </Box>
  );
}
