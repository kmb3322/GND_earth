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
  Link,
  Spinner,
  Text,
  VStack,
  VisuallyHidden,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaInstagram, FaYoutube } from 'react-icons/fa';
import SuccessScreen from './SuccessScreen';

export default function TicketScreen() {
  /* ────────────── local state ────────────── */
  const [step, setStep]         = useState('form'); // 'form' | 'success'
  const [ticketNo, setTicketNo] = useState(null);
  const [name, setName]         = useState('');
  const [isPaid, setIsPaid]     = useState(false);
  const [dupChecked, setDupChecked] = useState(false);

  /* code 입력용 */
  const [code, setCode] = useState('');
  const codeValid = /^[A-Z]\d{4}$/.test(code);

  /* lookup 결과 */
  const [isExisting, setIsExisting]     = useState(false);
  const [existingInfo, setExistingInfo] = useState(null); // { ticketNo, isPaid }

  /* ────────────── RHF 세팅 ────────────── */
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

  /* ────────────── 파일 미리보기 ────────────── */
  const watchedScreenshot = watch('screenshot');
  const screenshotURL     = useMemo(
    () =>
      watchedScreenshot?.length
        ? URL.createObjectURL(watchedScreenshot[0])
        : null,
    [watchedScreenshot],
  );

  /* ────────────── 중복 확인 (디바운스) ────────────── */
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

  const watchedName  = watch('name');
  const watchedPhone = watch('phone');

  /* 이름/폰 입력 여부 & 전화번호 패턴 검증 */
  const nameFilled   = !!watchedName?.trim();
  const phoneValid   = /^\d{3}-\d{3,4}-\d{4}$/.test(watchedPhone || '');

  const showCodeInput  =
    dupChecked && !isExisting && nameFilled && phoneValid;
  const showScreenshot = showCodeInput && codeValid;

  const accountNumber = '94290201906113';
  const { onCopy, hasCopied } = useClipboard(accountNumber);

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

  /* 중복 발견 시 스크린샷 & 코드 초기화 */
  useEffect(() => {
    if (isExisting) {
      setValue('screenshot', undefined, { shouldValidate: false });
      clearErrors('screenshot');
      unregister('screenshot');

      setCode('');
      unregister('code');
      clearErrors('code');
    }
  }, [isExisting, setValue, clearErrors, unregister]);

  /* showScreenshot false → 스크린샷 필드 제거 */
  useEffect(() => {
    if (!showScreenshot) {
      unregister('screenshot');
      clearErrors('screenshot');
    }
  }, [showScreenshot, unregister, clearErrors]);

  /* showCodeInput false → code 필드 제거 */
  useEffect(() => {
    if (!showCodeInput) {
      unregister('code');
      clearErrors('code');
      setCode('');
    }
  }, [showCodeInput, unregister, clearErrors]);

  /* ────────────── 핸들러 ────────────── */
  // 전화번호 하이픈 포매터
  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 3 && v.length <= 6) v = `${v.slice(0, 3)}-${v.slice(3)}`;
    else if (v.length > 6)
      v = `${v.slice(0, 3)}-${v.slice(3, v.length - 4)}-${v.slice(-4)}`;
    setValue('phone', v, { shouldValidate: true });
  };

  // 스크린샷 업로드
  const handleScreenshot = (e) =>
    setValue('screenshot', e.target.files, { shouldValidate: true });

  /* 신규 등록 submit */
  const onSubmit = async (data) => {
    if (isExisting) return; // 이미 등록된 경우 금지

    const { screenshot, ...payload } = data; // 파일은 전송 안 함
    try {
      const res = await axios.post(
        'https://gnd-back.vercel.app/api/register',
        payload,
      );

      if (res.data.success) {
        setName(payload.name);
        setTicketNo(res.data.ticketNo);
        setIsPaid(!!res.data.isPaid);
        setStep('success');
      } else {
        toast({
          title: '등록 실패',
          description: res.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: '서버 오류',
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
    <VStack spacing={0} align="center" mt={2} pb={24} position="relative">
      {/* 상단 이미지 & 정보 */}
      <Box pt={{ base: 6, md: 10 }} />
      <Image
        src="/gnd_vol2.png"
        alt="GND2"
        boxSize={{ base: '280px', md: '450px' }}
        objectFit="contain"
        mt={-55}
        mb={{ base: '-20px', md: '-60px' }}
      />
      <Text
        mb={5}
        color="gray.700"
        fontFamily="mono"
        fontWeight="700"
        fontSize="16px"
      >
        GND SEOUL vol.2
      </Text>
      <Text
        mt={5}
        color="gray.700"
        fontFamily="mono"
        fontWeight="500"
        fontSize="14px"
      >
        서울 마포구 독막로7길 20
      </Text>
      <Text
        mb={6}
        color="gray.700"
        fontFamily="mono"
        fontWeight="500"
        fontSize="14px"
        textAlign="center"
      >
        2025 07 18
      </Text>
      <Text
        mt={7}
        color="gray.700"
        fontFamily="mono"
        fontWeight="700"
        fontSize="15px"
        textAlign="center"
      >
        ₩20,000
      </Text>
      <Flex direction="row" justify="center" align="center" gap="1" mt={1} wrap="wrap">
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
          fontWeight="500"
          fontSize="12px"
          textAlign="center"
          cursor="pointer"
          textDecoration="underline"
        >
          김민범 KB국민은행 {accountNumber}
        </Text>
        <Text
          fontFamily="noto"
          fontWeight="500"
          fontSize="12px"
          color="gray.700"
          textAlign="center"
        >
          으로 입금 바랍니다.
        </Text>
      </Flex>

      {/* 입력 폼 */}
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        w="100%"
        maxW="400px"
        mt={6}
        px={4}
      >
        {/* 이름 */}
        <FormControl isInvalid={!!errors.name} mb={5}>
          <Input
            placeholder="Name"
            {...register('name', {
              required : '이름을 입력해주세요.',
              maxLength: { value: 50, message: '최대 50자까지 가능' },
            })}
            bg="white"
            borderRadius="20px"
            border="1px solid #E8E8E8"
            boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
            fontSize="14px"
            fontFamily="noto"
            _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
          />
          <FormErrorMessage fontFamily="noto">
            {errors.name?.message}
          </FormErrorMessage>
        </FormControl>

        {/* 전화번호 */}
        <FormControl isInvalid={!!errors.phone} mb={5}>
          <Input
            placeholder="Phone Number"
            {...register('phone', {
              required: '전화번호를 입력해주세요.',
              pattern : { value: /^\d{3}-\d{3,4}-\d{4}$/ },
            })}
            onChange={handlePhone}
            maxLength={13}
            bg="white"
            borderRadius="20px"
            border="1px solid #E8E8E8"
            boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
            fontSize="14px"
            fontFamily="noto"
            _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
          />
          <FormErrorMessage fontFamily="noto">
            {errors.phone?.message}
          </FormErrorMessage>
        </FormControl>

        {/* 코드 입력: 신규 + 이름/폰 완료 */}
        {showCodeInput && (
          <FormControl isInvalid={!!errors.code} mb={5}>
            <Input
              placeholder="Invite Code (e.g., A1234)"
              {...register('code', {
                required: '코드를 입력하세요.',
                pattern : { value: /^[A-Z]\d{4}$/, message: '형식이 올바르지 않습니다.' },
                onChange: (e) =>
                  setCode(e.target.value.toUpperCase()),
              })}
              value={code}
              maxLength={5}
              bg="white"
              borderRadius="20px"
              border="1px solid #E8E8E8"
              boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
              fontSize="14px"
              fontFamily="noto"
              _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }}
            />
            <FormErrorMessage fontFamily="noto">
              {errors.code?.message}
            </FormErrorMessage>
          </FormControl>
        )}

        {/* 스크린샷: 코드가 유효해야 노출 */}
        {showScreenshot && (
          <FormControl isInvalid={!!errors.screenshot} mb={8}>
            <VisuallyHidden>
              <Input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                onChange={handleScreenshot}
                {...register('screenshot', {
                  required: '스크린샷을 첨부해주세요.',
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
              fontFamily="noto"
              color="gray.500"
              justifyContent="flex-start"
              cursor="pointer"
            >
              {screenshotURL ? '스크린샷 변경' : '입금 확인 스크린샷 첨부'}
            </Button>

            <Text mt={2} fontFamily="noto" fontSize="10px" color="gray.500">
              위에 기입한 이름과 동일한 입금자명으로 ₩20,000 입금 후,
              입금자명이 화면에 표시된 스크린샷을 첨부해주세요.
            </Text>

            {screenshotURL && (
              <>
                <Text
                  mt={2}
                  fontFamily="noto"
                  fontSize="12px"
                  color="green.500"
                  fontWeight="700"
                >
                  입금 확인 스크린샷 첨부 완료.
                </Text>
                <Image
                  src={screenshotURL}
                  alt="screenshot preview"
                  mt={2}
                  borderRadius="12px"
                  maxH="200px"
                  objectFit="cover"
                />
              </>
            )}

            <FormErrorMessage fontFamily="noto">
              {errors.screenshot?.message}
            </FormErrorMessage>
          </FormControl>
        )}

        {/* 버튼 영역 */}
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
            fontFamily="mono"
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
            예매 정보 확인하기
          </Button>
        ) : (
          <Button
            type="submit"
            w="100%"
            bg="black"
            color="white"
            borderRadius="20px"
            fontFamily="mono"
            fontWeight="700"
            fontSize="14px"
            isLoading={isSubmitting}
            isDisabled={!isValid || !showScreenshot || isSubmitting}
            _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
            _disabled={{ display: 'none' }}
            mb={5}
          >
            JOIN
          </Button>
        )}

        {/* 하단 안내 & SNS 링크 (생략 부분 그대로) */}
        {/* 하단 안내 */}
        <Text
          textAlign="center"
          color="gray.700"
          fontFamily="noto"
          fontWeight="500"
          fontSize="12px"
        >
          이미 신청하신 분들은 동일 정보를 입력하시면<br />
          신청 내역 및 입금 확인 여부를 확인하실 수 있습니다.
        </Text>

        {/* SNS / 문의 */}
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
    </VStack>
  );
}
