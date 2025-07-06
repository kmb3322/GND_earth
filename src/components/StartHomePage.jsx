import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  AspectRatio, Box, Button, Flex, Grid, Icon,
  Image,
  Link, Text, VStack, useBreakpointValue,
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
    'GND는 높은 잠재력을 지닌 다양한 분야(미술, 음악, 영상, 무용 등)의 아티스트들을 한 자리에 모시고, 보다 큰 무대를 제공하고자 합니다.',
    '여러 작가와 창작자들이 함께 작업하는 과정에서 얻게 되는 지식과 아이디어의 교류는 개인의 역량을 확장할 뿐 아니라, 예술 생태계 전반의 성장에도 크게 기여할 수 있습니다.',
    'GND는 나아가 아티스트들이 서로의 작품 세계를 공유하고 자유롭게 논의할 수 있는 네트워킹 장을 구축하여, 기존에 없던 협업과 창작의 기회를 창출하는 것을 목표로 하고 있습니다.',
  ];

  const people = [
    {
      name: '정수빈',
      role: 'Leader & Head Director',
      desc: ['KAIST 산업디자인학과 23학번', 'KFAC(KAIST 금융 학회)', 'KAIST 입학처 주관 창글리 캠프 기획·운영 (2023.07.31, 2024.01.22, 2024.01.29, 2024.07.29, 2025.01.20)'],
    },
    {
      name: '채도빈',
      role: 'Artist & Music Director',
      desc: ["2022.7.16 EP 'BREAK THE MINOR' 데뷔","공연 'THE TOUR BUS' 기획 총괄", "밀라노 Fashion Week MilanloveSeoul 초청 아티스트 (2025.02.28)", "Instagram @chaedobin", "Soundcloud CHAEDOBIN"],
    },
    {
      name: '김민범',
      role: 'Marketing Director (Video & Web)',
      desc: ['KAIST 전산학부 23학번', 'KAIST Interaction Lab KIXLAB', "대학가요제 '태울뮤직페스티벌 (2024.05.22)' 총기획·감독", '전국 단위 단편영화제 및 공모전 다수 수상', 'MinbeomKim.com'],
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

  // Breakpoint 값 설정
  const nameBottom = useBreakpointValue({ base: '40%', lg: '40%' });
  const joinBottom = useBreakpointValue({ base: '30%', lg: '30%' });
  const dateBottom = useBreakpointValue({ base: '20%', lg: '17%' });
  const scrollBottom = useBreakpointValue({ base: '10%', lg: '5%' });



  return (
    <Box bg="#F2F2F2"
    minH="100vh"
    position="relative"
    overflowX="hidden"
    px={{ base: 4, sm: 8, md: 16 }}
    >
    

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
        {/* 로고 
        <Text color="gray.700" fontFamily="mono" fontSize="18px" fontWeight="bold" mb="40px" mr="220px">
          SADGAS
        </Text>
        <Text color="gray.700" fontFamily="mono" fontSize="16px" fontWeight="bold" mb="40px">
          X
        </Text>
        <Text color="gray.700" fontFamily="mono" fontSize="16px" fontWeight="bold" ml="220px" mb="60px">
          GND
        </Text>*/}
        <Image src="/gnd_vol2.png"
          alt="GND2"
          boxSize='700px'
          objectFit="contain"
          position="absolute"
          top="-12%"          // 화면 높이 기준 Y 위치
          left="52%"         // 가로 중앙
          transform="translateX(-50%)" />
      

      <Text
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          color="gray.700"
          fontFamily="mono"
          fontWeight={700}
          fontSize="18px"
          bottom={nameBottom} // 반응형으로 위치 조정
        >          
        GND SEOUL vol.2
        </Text>
  
        {/* 날짜 */}
        <Text
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          color="gray.700"
          fontFamily="mono"
          fontWeight={500}
          fontSize="14px"
          bottom={dateBottom} // 반응형으로 위치 조정
        >          
        서울 마포구 독막로7길 20<br />2025 07 18
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
              fontWeight="700"
              bg="black"
              color="white"
              fontSize="14px"
              borderRadius="full"
              px={8}
              py={5}
              boxShadow="0 4px 12px rgba(0,0,0,0.25)"
              _hover={{ bg: 'gray.700', transform: 'scale(1.03)' }}
              _active={{ bg: 'gray.800' }}
              
              bottom={joinBottom} // 반응형으로 위치 조정
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              JOIN
            </MotionButton>
          )}
        </AnimatePresence>

        {/* 아래로 스크롤 버튼 */}
        <MotionButton
            position="absolute"
          bottom={scrollBottom}
          variant="ghost"
          onClick={() => scrollTo(infoRef)}
          _hover={{ transform: 'translateY(2px)' }}
          _active={{ transform: 'translateY(4px)' }}
          aria-label="scroll"
          color="gray.700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
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
        bg="#F2F2F2"
        bgGradient="linear(to-b,#F2F2F2 0%,rgba(245,245,245,0) 100%)"
      >
        <VStack spacing={2} maxW="900px" mx="auto" px={20}>
          <AspectRatio width={{ base: '100vw', md: '80vw' }} ratio={16 / 9}>
            <iframe
              src="https://www.youtube.com/embed/Xfkr6HS8J6o?start=60&autoplay=1&mute=1&playsinline=1&controls=1&loop=1&playlist=Xfkr6HS8J6o"
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
            fontFamily="mono"
            fontSize="28px"
            textAlign="center"
            fontWeight="700"
            mb={10}
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

          {/* ───── GND 더 알아보기 버튼 ───── */}
          <AnimatePresence> 
            <MotionButton
              key="gnd-more-btn"
              as="a"                          // 외부 PDF 링크
              href="/gndinfo.pdf"            // public 폴더 기준 경로
              target="_blank"                 // 새 탭
              rel="noopener noreferrer"
              fontFamily="noto"
              bg="#f2f2f2"
              color="303030"
              border="2px solid #606060"
              borderRadius="full"
              px={5}
              py={4}
              fontSize="14px"
              fontWeight={500}
              boxShadow="0 4px 12px rgba(0,0,0,0.1)"
              _hover={{ bg: 'gray.100', transform: 'scale(1.03)' }}
              _active={{ bg: 'gray.200' }}
              mt={100}                  
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              GND 더 알아보기
            </MotionButton>
            <Text
            fontFamily="mono"
            fontSize="12px"
            textAlign="center"
            fontWeight="500"
            mb={10}
          >
            창의적인 젊은 아티스트들이 모인 환상적인 네트워크 공간,<br/> GND EARTH에 참여하세요.
          </Text>
          </AnimatePresence>

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
      </VStack>
    </Box>
  );
}
