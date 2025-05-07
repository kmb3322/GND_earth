import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  CloseButton,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import SuccessScreen from './SuccessScreen';

/**
 * RegistrationForm (rev. no-interest, screenshot validation only)
 * - Interest 필드 제거
 * - 스크린샷은 필수 입력(프론트 검증) / 서버 전송 X
 * - 서버에는 name, phone JSON 으로만 POST
 */
const RegistrationForm = () => {
  const [status, setStatus] = useState(null); // null | 'error' | 'success'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const toast = useToast();

  // validation schema (interest 제거)
  const schema = Yup.object().shape({
    name: Yup.string()
      .required('이름을 입력해주세요.')
      .max(50, '최대 50자까지 입력 가능합니다.'),
    phone: Yup.string()
      .required('전화번호를 입력해주세요.')
      .matches(/^\d{3}-\d{3,4}-\d{4}$/,'전화번호를 XXX-XXX(X)-XXXX 형식으로 입력해주세요.'),
    screenshot: Yup.mixed()
      .required('입금 인증 스크린샷을 첨부해주세요.')
      .test('fileType', '이미지 파일만 업로드 가능합니다.', (value) => {
        return (
          value &&
          value.length &&
          ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(value[0].type)
        );
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // phone auto-hyphen
  const handlePhone = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 3 && val.length <= 6) {
      val = `${val.slice(0, 3)}-${val.slice(3)}`;
    } else if (val.length > 6) {
      val = `${val.slice(0, 3)}-${val.slice(3, val.length - 4)}-${val.slice(-4)}`;
    }
    setValue('phone', val, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 서버로는 이름, 전화번호만 보냄 (JSON)
      const res = await axios.post('https://gnd-back.vercel.app/api/register', {
        name: data.name,
        phone: data.phone,
      });

      if (res.data.success) {
        setSubmittedName(data.name);
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(res.data.message || '알 수 없는 오류 발생');
      }
    } catch (err) {
      setStatus('error');
      setMessage('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'success') return <SuccessScreen name={submittedName} />;

  return (
    <VStack spacing={10} width="100%" align="center" justify="center" padding="20px" mt={10}>
      {/* 입금 안내 */}
      <VStack spacing={2}>
        <Text fontFamily="noto" fontSize="14px" fontWeight="bold" textAlign="center">
          3333-25-4837088 카카오뱅크 정수빈
        </Text>
        <Text fontFamily="noto" fontSize="12px" textAlign="center">
          ₩20,000원 입금 후 스크린샷을 첨부해주세요.
        </Text>
      </VStack>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '400px' }}>
        <VStack spacing={6}>
          {/* 이름 */}
          <FormControl isInvalid={errors.name}>
            <Input
              placeholder="Your Name"
              {...register('name')}
              fontFamily="noto"
              fontSize="12px"
              bg="white"
              borderRadius="20px"
              border="1px solid #E8E8E8"
              boxShadow="0px 0px 10px 1px rgba(0,0,0,0.10)"
              color="black"
              fontWeight="400"
              letterSpacing="-0.5px"
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          {/* 전화번호 */}
          <FormControl isInvalid={errors.phone}>
            <Input
              placeholder="Phone Number"
              {...register('phone')}
              onChange={handlePhone}
              maxLength={13}
              fontFamily="noto"
              fontSize="12px"
              bg="white"
              borderRadius="20px"
              border="1px solid #E8E8E8"
              boxShadow="0px 0px 10px 1px rgba(0,0,0,0.10)"
              color="black"
              fontWeight="400"
              letterSpacing="-0.5px"
            />
            <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
          </FormControl>

          {/* 스크린샷 업로드 */}
          <FormControl isInvalid={errors.screenshot}>
            {/* 숨겨진 파일 인풋 */}
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              {...register('screenshot')}
              display="none"
            />

            {/* 커스텀 업로드 버튼 */}
            <Button
              as="label"
              htmlFor="screenshot"
              justifyContent="flex-start"
              w="100%"
              fontSize="12px"
              fontFamily="noto"
              fontWeight="400"
              bg="white"
              color="gray.500"
              letterSpacing="-0.5px"
              borderRadius="20px"
              border="1px solid #E8E8E8"
              boxShadow="0px 0px 10px 1px rgba(0,0,0,0.10)"
              _hover={{ bg: 'gray.50', transform: 'scale(1.02)' }}
              _active={{ bg: 'gray.100' }}
            >
              스크린샷 선택 (입금자명이 보이도록 캡처해주세요)
            </Button>

            {/* 파일명 표시 */}
            {watch('screenshot')?.length > 0 && (
              <Text mt={2} ml={1} fontSize="12px" color="gray.700" fontFamily="noto">
                {watch('screenshot')[0].name}
              </Text>
            )}

            <FormErrorMessage>{errors.screenshot?.message}</FormErrorMessage>
          </FormControl>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            bg="black"
            fontFamily="mono"
            fontWeight="700"
            fontSize="14px"
            color="white"
            width="100%"
            borderRadius="20px"
            boxShadow="0px 0px 10px 1px rgba(0,0,0,0.10)"
            isLoading={isLoading}
            _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
            _active={{ bg: 'gray.800' }}
          >
            제출하기
          </Button>
        </VStack>
      </form>

      {status === 'error' && (
        <Alert status="error" width="100%" maxWidth="400px" borderRadius="lg" mt={4}>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" onClick={() => setStatus(null)} />
        </Alert>
      )}
    </VStack>
  );
};

export default RegistrationForm;
