// src/components/TicketScreen.jsx
// =========================================
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
  VisuallyHidden,
  useBreakpointValue,
  useClipboard,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import SuccessScreen from './SuccessScreen';

export default function TicketScreen() {
  /* ────────────── local state ────────────── */
  const [step, setStep]         = useState('form');
  const [ticketNo, setTicketNo] = useState(null);
  const [name, setName]         = useState('');
  const [isPaid, setIsPaid]     = useState(false);

  const [dupChecked, setDupChecked]   = useState(false);
  const [isExisting, setIsExisting]   = useState(false);
  const [existingInfo, setExistingInfo] = useState(null);

  /* ────────────── RHF ────────────── */
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    setValue,
    clearErrors,
    unregister,
  } = useForm({ mode: 'onChange' });

  /* ────────────── 미리보기 ────────────── */
  const watchedScreenshot = watch('screenshot');
  const screenshotURL     = useMemo(
    () =>
      watchedScreenshot?.length
        ? URL.createObjectURL(watchedScreenshot[0])
        : null,
    [watchedScreenshot],
  );

  /* ────────────── 이름·전화 체크 ────────────── */
  const watchedName  = watch('name');
  const watchedPhone = watch('phone');

  const nameFilled = !!watchedName?.trim();
  const phoneValid = /^\d{3}-\d{3,4}-\d{4}$/.test(watchedPhone || '');

  const showScreenshot = dupChecked && !isExisting && nameFilled && phoneValid;
  const accountNumber = '3333-24-8961557';
  const { onCopy, hasCopied } = useClipboard(accountNumber);
  
  const isMobile = useBreakpointValue({ base: true, md: false });

  /* ────────────── 전화번호 중복 확인 ────────────── */
  const checkDuplicate = useMemo(
    () =>
      debounce(async (n, p) => {
        setDupChecked(false);
        if (!n || !/^\d{3}-\d{3,4}-\d{4}$/.test(p)) {
          setIsExisting(false);
          setExistingInfo(null);
          setDupChecked(false);
          return;
        }
        try {
          const { data } = await axios.get(
            'https://gnd-back.vercel.app/api/lookup',
            { params: { name: n, phone: p } },
          );
          if (data.exists) {
            setIsExisting(true);
            setExistingInfo({
              ticketNo: data.ticketNo,
              isPaid  : data.isPaid,
            });
          } else {
            setIsExisting(false);
            setExistingInfo(null);
          }
        } catch {
          setIsExisting(false);
          setExistingInfo(null);
        } finally {
          setDupChecked(true);
        }
      }, 300),
    [],
  );

  /* ────────────── useEffect: 중복 확인 ────────────── */
  useEffect(() => {
    if (!nameFilled || !phoneValid) {
      setDupChecked(true);
      setIsExisting(false);
      setExistingInfo(null);
      return;
    }
    setDupChecked(false);
    checkDuplicate(watchedName, watchedPhone);
  }, [watchedName, watchedPhone, nameFilled, phoneValid, checkDuplicate]);

  /* 중복 발견 시 값 초기화 */
  useEffect(() => {
    if (isExisting) {
      setValue('screenshot', undefined);
      unregister('screenshot');
      clearErrors('screenshot');
    }
  }, [isExisting, setValue, unregister, clearErrors]);

  /* ────────────── 전화번호 하이픈 ────────────── */
  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 3 && v.length <= 6) v = `${v.slice(0, 3)}-${v.slice(3)}`;
    else if (v.length > 6)
      v = `${v.slice(0, 3)}-${v.slice(3, v.length - 4)}-${v.slice(-4)}`;
    setValue('phone', v, { shouldValidate: true });
  };

  /* 스크린샷 핸들러 */
  const handleScreenshot = (e) =>
    setValue('screenshot', e.target.files, { shouldValidate: true });

  /* ────────────── submit ────────────── */
  const onSubmit = async (data) => {
    if (isExisting) return;

    const { screenshot, ...payload } = data;
    try {
      const res = await axios.post('https://gnd-back.vercel.app/api/register', payload);
      if (res.data.success) {
        setName(payload.name);
        setTicketNo(res.data.ticketNo);
        setIsPaid(res.data.isPaid);
        
        setStep('success');
      } else {
        toast({
          title: 'Registration Failed / 등록 실패',
          description: res.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Server Error / 서버 오류',
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  /* ────────────── 성공 화면 ────────────── */
  if (step === 'success')
    return <SuccessScreen name={name} ticketNo={ticketNo} isPaid={isPaid} />;

  /* ────────────── 폼 화면 ────────────── */
  return (
    <Box
      bg="#f0f0f0"
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

      {/* 데스크톱: 왼쪽 중앙 고정 */}
      <VStack
        display={{ base: 'none', md: 'flex' }}
        position="absolute"
        left={{ md: 7, lg: 7 }}
        top="50%"
        transform="translateY(-50%)"
        align="flex-start"
        spacing={0}
      >
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize="18px"
        >
          C&C: SHOW CASE
        </Text>
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize="18px"
        >
          PRESENTED BY GND
        </Text>
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize="18px"
        >
          2026 02 22
        </Text>
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize="18px"
        >
          HONEY CLOVER SEOUL
        </Text>
        <Text
          color="#000000"
          fontFamily="unica"
          fontWeight={600}
          fontSize="18px"
        >
          7, YONSEI-RO 7-AN-GIL, SEODAEMUN-GU
        </Text>
      </VStack>

      {/* 모바일 전용 컨텐츠 */}
      {isMobile && (
      <VStack 
        spacing={0} 
        align="center" 
        justify="center"
        minH="100vh"
        py={8}
        w="100%"
        overflowY="auto"
        overflowX="hidden"
      >
        {/* 모바일: 이벤트 정보 상단 */}
        <VStack
          align="flex-start"
          spacing={0}
          w="100%"
          maxW="400px"
          px={4}
        >
          <Text
            color="#000000"
            fontFamily="unica"
            fontWeight={600}
            fontSize="12px"
          >
            C&C: SHOW CASE
          </Text>
          <Text
            color="#000000"
            fontFamily="unica"
            fontWeight={600}
            fontSize="12px"
          >
            PRESENTED BY GND
          </Text>
          <Text
            color="#000000"
            fontFamily="unica"
            fontWeight={600}
            fontSize="12px"
          >
            2026 02 22
          </Text>
          <Text
            color="#000000"
            fontFamily="unica"
            fontWeight={600}
            fontSize="12px"
          >
            HONEY CLOVER SEOUL
          </Text>
          <Text
            color="#000000"
            fontFamily="unica"
            fontWeight={600}
            fontSize="12px"
          >
            7, YONSEI-RO 7-AN-GIL, SEODAEMUN-GU
          </Text>
        </VStack>
      
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          w="100%"
          maxW="400px"
          mt={6}
          px={4}
        >
        {/* ───────── 이름 ───────── */}
        <FormControl isInvalid={!!errors.name} mb={5}>
          <Input
            placeholder="Name"
            {...register('name', {
              required : 'Please enter your name / 이름을 입력해주세요.',
              maxLength: { value: 50, message: 'Max 50 characters / 최대 50자' },
            })}
            bg="white"
            borderRadius="20px"
            border="1px solid #E8E8E8"
            boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
            fontSize="14px"
            fontFamily="unica"
            _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
          />
          <FormErrorMessage fontFamily="unica" fontSize="12px" fontWeight="500">{errors.name?.message}</FormErrorMessage>
        </FormControl>

        {/* ───────── 전화번호 ───────── */}
        <FormControl isInvalid={!!errors.phone} mb={5}>
          <Input
            placeholder="Phone Number"
            {...register('phone', {
              required: 'Please enter your phone number / 전화번호를 입력해주세요.',
              pattern : { value: /^\d{3}-\d{3,4}-\d{4}$/ },
            })}
            onChange={handlePhone}
            maxLength={13}
            bg="white"
            borderRadius="20px"
            border="1px solid #E8E8E8"
            boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
            fontSize="14px"
            fontFamily="unica"
            _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
          />
          <FormErrorMessage fontFamily="unica" fontSize="12px" fontWeight="500">{errors.phone?.message}</FormErrorMessage>
        </FormControl>

        {/* ───────── 스크린샷 ───────── */}
        {showScreenshot && (
          <FormControl isInvalid={!!errors.screenshot} mb={8}>
            <VisuallyHidden>
              <Input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                onChange={handleScreenshot}
                {...register('screenshot', {
                  required: 'Please attach a screenshot / 스크린샷을 첨부해주세요.',
                })}
              />
            </VisuallyHidden>
              <Button
                as="label"
                htmlFor="screenshot-upload"
                w="100%"
                bg="white"
                borderRadius="20px"
                border="1px solid #E8E8E8"
                boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
                leftIcon={<Icon as={FaCamera} />}
                _hover={{ bg: 'gray.50', transform: 'scale(1.02)' }}
                fontSize="12px"
                fontFamily="unica"
                color="gray.700"
                justifyContent="flex-start"
                cursor="pointer"
                whiteSpace="normal"
                height="auto"
                py={3}
                textAlign="left"
              >
                <Box>
                  {screenshotURL ? (
                    <>
                      <Text as="span" fontWeight="600">Change Screenshot</Text>
                      <br />
                      <Text as="span" fontSize="10px" color="gray.500" fontFamily="noto">스크린샷 변경</Text>
                    </>
                  ) : (
                    <>
                      <Text as="span" fontWeight="600" mx={1}>1 drink pre-order required</Text>
                      <br />
                      <Text as="span" fontSize="10px" color="gray.500" fontFamily="noto" mx={1}>1인 1음료 사전 주문 필수</Text>
                    </>
                  )}
                </Box>
              </Button>

              {/* JOIN 버튼 - Change Screenshot 바로 아래 */}
              <Button
                type="submit"
                w="100%"
                mt={3}
                bg={screenshotURL ? "black" : "gray.300"}
                color="white"
                borderRadius="20px"
                fontFamily="unica"
                fontWeight="700"
                fontSize="14px"
                isLoading={isSubmitting}
                isDisabled={!isValid || !screenshotURL || isSubmitting}
                _hover={screenshotURL ? { bg: 'gray.700', transform: 'scale(1.02)' } : {}}
                _disabled={{ bg: 'gray.300', cursor: 'not-allowed' }}
                cursor={screenshotURL ? "pointer" : "not-allowed"}
              >
                JOIN
              </Button>

              <VStack mt={5} align="flex-start" spacing={1}>
            <Text
                fontFamily="unica"
                fontSize="12px"
                fontWeight="700"
                color="gray.700"
              >
                Alcohol drinks - ₩7,000<br />
                Non-Alcohol drinks - ₩3,000
              </Text>
              <Text
                fontFamily="unica"
                fontSize="10px"
                color="gray.500"
                textAlign="left"
                fontWeight="300"

              >
                Alcoholic beverages will not be served without valid ID verification on the day,<br />
                even if pre-purchased.<br />
                신분증을 통한 당일 성인인증이 되지 않으면,<br />
                사전 구매를 하더라도 알코올 음료가 제공되지 않습니다.
              </Text>
              <Flex direction="row" justify="flex-start" align="center" gap="1" mt={1} wrap="wrap">
                <Text
                  as="button"
                  type="button"
                  onClick={() => {
                    onCopy();
                    toast({
                      title: '계좌번호가 복사되었습니다.',
                      status: 'success',
                      duration: 2500,
                      isClosable: true,
                    });
                  }}
                  color={hasCopied ? 'green.500' : 'gray.700'}
                  fontFamily="noto"
                  fontWeight="700"
                  fontSize="12px"
                  textAlign="left"
                  cursor="pointer"
                  textDecoration="underline"
                >
                  백종서 카카오뱅크 {accountNumber}
                </Text>
                <Text
                  fontFamily="noto"
                  fontSize="12px"
                  fontWeight="700"
                  color="gray.700"
                  textAlign="left"
                >
                  입금 후 입금 내역 스크린샷을 첨부해주세요.
                </Text>
              </Flex>
              <Flex direction="row" justify="flex-start" align="center" gap="1" mt={0} wrap="wrap">
                <Text
                  color="gray.500"
                  fontFamily="unica"
                  fontWeight="300"
                  fontSize="10px"
                  textAlign="left"
                >
                  Jongseo Baek Kakao Bank {accountNumber}
                </Text>
                <Text
                  fontFamily="unica"
                  fontWeight="300"
                  fontSize="10px"
                  color="gray.500"
                  textAlign="left"
                >
                  Please attach a screenshot of the deposit after making the payment.
                </Text>
              </Flex>
              
            </VStack>

            {screenshotURL && (
              <>
                <Text
                  mt={2}
                  fontFamily="unica"
                  fontSize="12px"
                  color="green.500"
                  fontWeight="700"
                >
                  Screenshot Attached / 스크린샷 첨부 완료
                </Text>
                <Image
                  src={screenshotURL}
                  alt="screenshot preview"
                  mt={2}
                  mb={4}
                  borderRadius="12px"
                  maxH="200px"
                  objectFit="cover"
                  w="100%"
                />
              </>
            )}
            <FormErrorMessage fontFamily="unica" fontSize="12px" fontWeight="500">{errors.screenshot?.message}</FormErrorMessage>
          </FormControl>
        )}

        {/* ───────── 버튼 ───────── */}
        {nameFilled && phoneValid && !dupChecked ? (
          <Button
            w="100%"
            bg="gray.400"
            color="white"
            borderRadius="20px"
            isDisabled
            leftIcon={<Spinner size="sm" />}
            mb={5}
          />
        ) : isExisting ? (
          <Button
            w="100%"
            bg="black"
            color="white"
            borderRadius="20px"
            fontFamily="unica"
            fontWeight="700"
            fontSize="14px"
            _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
            mb={5}
            onClick={() => {
              setName(watchedName);
              setTicketNo(existingInfo.ticketNo);
              setIsPaid(existingInfo.isPaid);
              setStep('success');
            }}
          >
            Check Reservation / 예매 정보 확인하기
          </Button>
        ) : null}

                </Box>

        {/* 하단 안내 - 모바일 (폼 내부에 배치) */}
        <VStack
          spacing={2}
          w="100%"
          mt={10}
          mb={6}
        >
          <Text
            textAlign="center"
            color="gray.700"
            fontFamily="unica"
            fontWeight="500"
            fontSize="10px"
          >
            If you have already registered, enter the same info<br />
            to check your reservation and payment status.<br /><br />
            이미 신청하신 분들은 동일 정보를 입력하시면<br />
            신청 내역 및 입금 확인 여부를 확인하실 수 있습니다.
          </Text>
        </VStack>
      </VStack>
      )}

      {/* 하단 안내 - 데스크톱 (좌우 배치) */}
      <Flex
        display={{ base: 'none', md: 'flex' }}
        position="absolute"
        bottom={8}
        left={0}
        right={0}
        justify="space-between"
        px={{ md: 7, lg: 7 }}
      >
        <Text
          color="gray.700"
          fontFamily="unica"
          fontWeight="500"
          fontSize="10px"
          textAlign="left"
        >
          If you have already registered,<br />
          enter the same info to check your<br />
          reservation and payment status.
        </Text>
        <Text
          color="gray.700"
          fontFamily="unica"
          fontWeight="500"
          fontSize="10px"
          textAlign="right"
        >
          이미 신청하신 분들은 동일 정보를 입력하시면<br />
          신청 내역 및 입금 확인 여부를<br />
          확인하실 수 있습니다.
        </Text>
      </Flex>

      {/* 데스크톱: 오른쪽 중앙 폼 */}
      {!isMobile && (
      <VStack
        position="absolute"
        right={{ md: 7, lg: 7 }}
        top="50%"
        transform="translateY(-50%)"
        align="flex-start"
        spacing={4}
      >
        

        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          w="300px"
        >
          <FormControl isInvalid={!!errors.name} mb={4}>
            <Input
              placeholder="Name"
              {...register('name', {
                required: 'Please enter your name / 이름을 입력해주세요.',
                maxLength: { value: 50, message: 'Max 50 characters / 최대 50자' },
              })}
              bg="white"
              borderRadius="20px"
              border="1px solid #E8E8E8"
              boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
              fontSize="14px"
              fontFamily="unica"
              _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
            />
            <FormErrorMessage fontFamily="unica" fontSize="12px" fontWeight="500">{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phone} mb={4}>
            <Input
              placeholder="Phone Number"
              {...register('phone', {
                required: 'Please enter your phone number / 전화번호를 입력해주세요.',
                pattern: { value: /^\d{3}-\d{3,4}-\d{4}$/ },
              })}
              onChange={handlePhone}
              maxLength={13}
              bg="white"
              borderRadius="20px"
              border="1px solid #E8E8E8"
              boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
              fontSize="14px"
              fontFamily="unica"
              _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
            />
            <FormErrorMessage fontFamily="unica" fontSize="12px" fontWeight="500">{errors.phone?.message}</FormErrorMessage>
          </FormControl>

          {showScreenshot && (
            <FormControl isInvalid={!!errors.screenshot} mb={4}>
              <VisuallyHidden>
                <Input
                  id="screenshot-upload-desktop"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshot}
                  {...register('screenshot', {
                    required: 'Please attach a screenshot / 스크린샷을 첨부해주세요.',
                  })}
                />
              </VisuallyHidden>
              <Button
                as="label"
                htmlFor="screenshot-upload-desktop"
                w="100%"
                bg="white"
                borderRadius="20px"
                border="1px solid #E8E8E8"
                boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
                leftIcon={<Icon as={FaCamera} />}
                _hover={{ bg: 'gray.50', transform: 'scale(1.02)' }}
                fontSize="11px"
                fontFamily="unica"
                color="gray.700"
                justifyContent="flex-start"
                cursor="pointer"
                whiteSpace="normal"
                height="auto"
                py={3}
                textAlign="left"
              >
                <Box>
                  {screenshotURL ? (
                    <>
                      <Text as="span" fontWeight="600">Change Screenshot</Text>
                      <br />
                      <Text as="span" fontSize="10px" color="gray.500" fontFamily="noto">스크린샷 변경</Text>
                    </>
                  ) : (
                    <>
                      <Text as="span" fontWeight="600" mx={1}>1 drink pre-order required</Text>
                      <br />
                      <Text as="span" fontSize="10px" color="gray.500" fontFamily="noto" mx={1}>1인 1음료 사전 주문 필수</Text>
                    </>
                  )}
                </Box>
              </Button>

              {/* JOIN 버튼 - Change Screenshot 바로 아래 */}
              <Button
                type="submit"
                w="100%"
                mt={3}
                bg={screenshotURL ? "black" : "gray.300"}
                color="white"
                borderRadius="20px"
                fontFamily="unica"
                fontWeight="700"
                fontSize="14px"
                isLoading={isSubmitting}
                isDisabled={!isValid || !screenshotURL || isSubmitting}
                _hover={screenshotURL ? { bg: 'gray.700', transform: 'scale(1.02)' } : {}}
                _disabled={{ bg: 'gray.300', cursor: 'not-allowed' }}
                cursor={screenshotURL ? "pointer" : "not-allowed"}
              >
                JOIN
              </Button>

              <VStack mt={5} align="flex-start" spacing={1}>
                <Text
                  fontFamily="unica"
                  fontSize="12px"
                  fontWeight="700"
                  color="gray.700"
                >
                  Alcohol drinks - ₩7,000<br />
                  Non-Alcohol drinks - ₩3,000
                </Text>
                <Text
                  fontFamily="unica"
                  fontSize="10px"
                  color="gray.500"
                  textAlign="left"
                  fontWeight="300"
                >
                  Alcoholic beverages will not be served<br />without valid ID verification on the day,
                  even if pre-purchased.<br />
                  신분증을 통한 당일 성인인증이 되지 않으면,<br />
                  사전 구매를 하더라도 알코올 음료가 제공되지 않습니다.
                </Text>
                <Flex direction="row" justify="flex-start" align="center" gap="1" mt={1} wrap="wrap">
                  <Text
                    as="button"
                    onClick={() => {
                      onCopy();
                      toast({
                        title: '계좌번호가 복사되었습니다.',
                        status: 'success',
                        duration: 2500,
                        isClosable: true,
                      });
                    }}
                    color={hasCopied ? 'green.500' : 'gray.700'}
                    fontFamily="noto"
                    fontWeight="700"
                    fontSize="12px"
                    textAlign="left"
                    cursor="pointer"
                    textDecoration="underline"
                  >
                    백종서 카카오뱅크 {accountNumber}
                  </Text>
                  <Text
                    fontFamily="noto"
                    fontSize="12px"
                    fontWeight="700"
                    color="gray.700"
                    textAlign="left"
                  >
                    입금 후 입금 내역 스크린샷을 첨부해주세요.
                  </Text>
                </Flex>
                <Flex direction="row" justify="flex-start" align="center" gap="1" mt={0} wrap="wrap">
                  <Text
                    color="gray.500"
                    fontFamily="unica"
                    fontWeight="300"
                    fontSize="10px"
                    textAlign="left"
                  >
                    Jongseo Baek Kakao Bank {accountNumber}
                  </Text>
                  <Text
                    fontFamily="unica"
                    fontWeight="300"
                    fontSize="10px"
                    color="gray.500"
                    textAlign="left"
                  >
                    Please attach a screenshot of the deposit after making the payment.
                  </Text>
                </Flex>
              </VStack>

              {screenshotURL && (
                <>
                  <Text
                    mt={2}
                    fontFamily="unica"
                    fontSize="12px"
                    color="green.500"
                    fontWeight="700"
                  >
                    Screenshot Attached / 스크린샷 첨부 완료
                  </Text>
                  <Image
                    src={screenshotURL}
                    alt="screenshot preview"
                    mt={2}
                    mb={4}
                    borderRadius="12px"
                    maxH="200px"
                    objectFit="cover"
                    w="100%"
                  />
                </>
              )}
              <FormErrorMessage fontFamily="unica" fontSize="12px" fontWeight="500">{errors.screenshot?.message}</FormErrorMessage>
            </FormControl>
          )}

          {nameFilled && phoneValid && !dupChecked ? (
            <Button
              w="100%"
              bg="gray.400"
              color="white"
              borderRadius="20px"
              isDisabled
              leftIcon={<Spinner size="sm" />}
            />
          ) : isExisting ? (
            <Button
              w="100%"
              bg="black"
              color="white"
              borderRadius="20px"
              fontFamily="unica"
              fontWeight="700"
              fontSize="14px"
              _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
              onClick={() => {
                setName(watchedName);
                setTicketNo(existingInfo.ticketNo);
                setIsPaid(existingInfo.isPaid);
                setStep('success');
              }}
            >
              Check Reservation
            </Button>
          ) : null}
        </Box>
      </VStack>
      )}
    </Box>
  );
}