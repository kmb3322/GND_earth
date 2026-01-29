import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  AspectRatio, Box, Button, Flex,
  Icon,
  Image,
  Link, Text, VStack, useBreakpointValue
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
    const id = setTimeout(() => setShowTicket(true), 200);
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
  const dateBottom = useBreakpointValue({ base: '25%', lg: '22%' });
  const scrollBottom = useBreakpointValue({ base: '7%', lg: '3%' });



  return (
    <Box bg="#f0f0f0"
    minH="100vh"
    position="relative"
    overflowX="hidden"
    w="100%"
    >
      {/* 상단 로고 */}
      <Box
        as={RouterLink}
        to="/"
        position="absolute"
        top={{ base: "20px", md: "30px" }}
        left="50%"
        transform="translateX(-50%)"
        zIndex={10}
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={{ base: "15px", md: "20px" }}
          cursor="pointer"
          transition="all 0.3s"
          _hover={{ opacity: 0.8, transform: 'scale(0.98)' }}
        />
      </Box>

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
        

          
  
        {/* 왼쪽 정렬 텍스트 그룹 */}
        <VStack
          position="absolute"
          left={{ base: 7, sm: 7, md: 7 }}
          top="50%"
          transform="translateY(-50%)"
          align="flex-start"
          spacing={0}
        >
          <Text
            color="#000000"
            fontFamily="unica"
            fontWeight={600}
            fontSize={{ base: "12px", md: "18px" }}
          >
            C&C: SHOW CASE
          </Text>
          <Text
            color="#000000"
            fontFamily="unica"
            fontWeight={600}
            fontSize={{ base: "12px", md: "18px" }}
          >
            PRESENTED BY GND
          </Text>
          <Text
            color="#000000"
            fontFamily="unica"
            fontWeight={600}
            fontSize={{ base: "12px", md: "18px" }}
          >
            2026 02 22
          </Text>
        </VStack>

        {/* JOIN 텍스트 링크 - 오른쪽 상하 중앙 */}
        {showTicket && (
          <Text
            as={RouterLink}
            to="/ticket"
            position="absolute"
            right={{ base: 7, sm: 7, md: 7 }}
            top="50%"
            transform="translateY(-50%)"
            fontFamily="unica"
            fontWeight={600}
            fontSize={{ base: "12px", md: "18px" }}
            color="#000000"
            cursor="pointer"
            _hover={{ color: '#555555' }}
          >
            JOIN
          </Text>
        )}




        {/* 아래로 스크롤 버튼 */}
        <MotionButton
            position="absolute"
          bottom={scrollBottom}
          variant="ghost"
          onClick={() => scrollTo(infoRef)}
          outline="none"
          border="none"
          _hover={{ color: 'gray.900', outline: 'none', boxShadow: 'none' }}
          _active={{ color: 'gray.900', outline: 'none', boxShadow: 'none' }}
          _focus={{ boxShadow: 'none', outline: 'none', border: 'none' }}
          _focusVisible={{ boxShadow: 'none', outline: 'none', border: 'none' }}
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

      {/* ───── Video ─────       */}
      <Box
        pt={20}
        pb={10}
        bg="#F0F0F0"
        bgGradient="linear(to-b,#F0F0F0 0%,rgba(245,245,245,0) 100%)"
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
        bgGradient="linear(to-b,rgba(242,242,242,0) 0%,#F0F0F0 100%)"
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

        

          {/* ───── GND 더 알아보기 버튼 ───── */}
          <AnimatePresence> 
            <MotionButton
              key="gnd-more-btn"
              as="a"                          // 외부 PDF 링크
              href="/gndinfo.pdf"            // public 폴더 기준 경로
              target="_blank"                 // 새 탭
              rel="noopener noreferrer"
              fontFamily="noto"
              bg="#F0F0F0"
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
