// src/components/TicketScreen.jsx
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
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaInstagram } from 'react-icons/fa';
import SuccessScreen from './SuccessScreen';

export default function TicketScreen() {
  /* ────────────── local state ────────────── */
  const [step, setStep]         = useState('form'); // 'form' | 'success'
  const [ticketNo, setTicketNo] = useState(null);
  const [name, setName]         = useState('');
  const [isPaid, setIsPaid]     = useState(false);
  const [dupChecked, setDupChecked] = useState(false); 

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
        } catch (e) {
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
  const nameFilled = !!watchedName?.trim();
  const phoneValid = /^\d{3}-\d{3,4}-\d{4}$/.test(watchedPhone || '');
  const showScreenshot = dupChecked && !isExisting && nameFilled && phoneValid;


useEffect(() => {
// 아직 둘 다 입력되지 않았으면 스피너도 끄고, 중복 확인도 생략
  if (!nameFilled || !phoneValid) {
    setDupChecked(true);          // "조회 끝" 처리
    setIsExisting(false);
    setExistingInfo(null);
    return;
  }

  setDupChecked(false);           // 스피너 ON
  checkDuplicate(watchedName, watchedPhone);
}, [
    watchedName,
    watchedPhone,
    nameFilled,
    phoneValid,
    checkDuplicate,
]);

  /* 중복 발견 시 스크린샷 초기화 */
  useEffect(() => {
    if (isExisting) {
      setValue('screenshot', undefined, { shouldValidate: false });
      clearErrors('screenshot');
      unregister('screenshot');
    }
  }, [isExisting, setValue, clearErrors, unregister]);

  /* showScreenshot=false → 스크린샷 필드 제거 */
  useEffect(() => {
    if (!showScreenshot) {
      unregister('screenshot');
      clearErrors('screenshot');
    }
  }, [showScreenshot, unregister, clearErrors]);

  /* ────────────── 핸들러 ────────────── */
  // 전화번호 하이픈 포매터
  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 3 && v.length <= 6) v = `${v.slice(0, 3)}-${v.slice(3)}`;
    else if (v.length > 6)
      v = `${v.slice(0, 3)}-${v.slice(3, v.length - 4)}-${v.slice(-4)}`;
    setValue('phone', v, { shouldValidate: true });
  };

  // 스크린샷 등록
  const handleScreenshot = (e) =>
    setValue('screenshot', e.target.files, { shouldValidate: true });

  /* 신규 등록 submit */
  const onSubmit = async (data) => {
    if (isExisting) return; // 이미 등록된 경우 submit 금지

    const { screenshot, ...payload } = data; // 파일은 전송하지 않음
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
  if (step === 'success') {
    return (
      <SuccessScreen
        name={name}
        ticketNo={ticketNo}
        isPaid={isPaid}
      />
    );
  }

  /* ────────────── 폼 화면 ────────────── */
  return (
    <VStack spacing={0} align="center" mt={2} pb={24} position="relative">
      {/* 상단 이미지 & 정보 */}
      <Box pt={{ base: 6, md: 10 }} />
      <Image
        src="/sadgasXgnd2.png"
        alt="SADGASXGND"
        boxSize={{ base: '280px', md: '450px' }}
        objectFit="contain"
        mt={-55}
        mb={-10}
      />
      <Text
        mt={-15}
        color="gray.700"
        fontFamily="mono"
        fontWeight="700"
        fontSize="16px"
      >
        SAD GAS X GND : HOMECOMMING DAY
      </Text>
      <Text
        mt={5}
        color="gray.700"
        fontFamily="mono"
        fontWeight="500"
        fontSize="14px"
      >
        2025 06 14
      </Text>
      <Text
        mb={2}
        color="gray.700"
        fontFamily="mono"
        fontWeight="500"
        fontSize="14px"
        textAlign="center"
      >
        서울 용산구 대사관로31길 ROSSO SEOUL
      </Text>
      <Text
        mb={2}
        color="gray.700"
        fontFamily="mono"
        fontWeight="500"
        fontSize="14px"
        textAlign="center"
      >
        ₩20,000
      </Text>

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
              pattern : {
                value  : /^\d{3}-\d{3,4}-\d{4}$/,
                message: 'XXX-XXXX-XXXX',
              },
            })}
            onChange={handlePhone}
            maxLength={13}
            bg="white"
            borderRadius="20px"
            border="1px solid #E8E8E8"
            boxShadow="0 0 10px 1px rgba(0,0,0,.1)"
            fontSize="14px"
            fontFamily="noto"
          />
          <FormErrorMessage fontFamily="noto">
            {errors.phone?.message}
          </FormErrorMessage>
        </FormControl>

        {/* 스크린샷: 신규 + 이름/폰 입력 완료 + 폰 형식 OK */}
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

            <Text
              mt={2}
              fontFamily="noto"
              fontSize="10px"
              color="gray.500"
              textAlign="left"
            >
              위에 기입한 이름과 동일한 입금자명으로 ₩20,000 입금 후,<br />
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
             >
            </Button>

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
            isDisabled={!isValid || isSubmitting}
            _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
            _disabled={{ display: 'none' }}
            mb={5}
          >
            JOIN
          </Button>
        )}

        {/* 하단 안내 */}
        <Text
          textAlign="center"
          color="gray.700"
          fontFamily="noto"
          fontWeight="500"
          fontSize="12px"
        >
          이미 신청하신 분들은 동일 정보를 입력하시면<br />
          신청 내역 및 입금 확인 내역을 확인하실 수 있습니다.
        </Text>

        {/* SNS / 문의 */}
        <Flex w="100%" justify="center" mt={10} mb={1}>
          <Link
            href="https://instagram.com/gnd_earth"
            isExternal
            color="gray.600"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaInstagram} mr={1} />
            <Text fontFamily="noto">gnd_earth</Text>
          </Link>
        </Flex>
        <Link href="tel:010-8288-3951" textDecoration="none">
          <Text
            fontFamily="noto"
            color="gray.500"
            fontSize="10px"
            textAlign="center"
          >
            문의 010-8288-3951
          </Text>
        </Link>
      </Box>
    </VStack>
  );
}
