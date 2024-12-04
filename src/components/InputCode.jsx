import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  CloseButton,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Spinner,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import axios from 'axios';  // axios 추가
import SuccessScreen from './SuccessScreen'; // 성공 화면 컴포넌트

const InputCode = () => {
  const [contactStatus, setContactStatus] = useState(null); // 'ready', 'success', 'error'
  const [contactMessage, setContactMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validatedCode, setValidatedCode] = useState(''); // 검증된 코드 저장

  const toast = useToast();

  // 코드 검증을 위한 Yup 스키마
  const codeValidationSchema = Yup.object().shape({
    code: Yup.string()
      .required('16자리 초대 코드를 입력해주세요.')
      .matches(/^(\d{4}-){3}\d{4}$/, '코드를 XXXX-XXXX-XXXX-XXXX 형식으로 입력해주세요.'),
  });

  // 연락처 제출을 위한 Yup 스키마
  const contactValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required('이름을 입력해주세요.')
      .max(50, '이름은 최대 50자까지 입력할 수 있습니다.'),
    phone: Yup.string()
      .required('전화번호를 입력해주세요.')
      .matches(/^\d{3}-\d{3,4}-\d{4}$/, '전화번호를 XXX-XXX(X)-XXXX 형식으로 입력해주세요.'),
  });

  // 코드 검증 폼 관리
  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: errorsCode },
    setValue: setValueCode,
  } = useForm({
    resolver: yupResolver(codeValidationSchema),
    mode: 'onChange',
  });

  // 연락처 제출 폼 관리
  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    formState: { errors: errorsContact },
    setValue: setValueContact,
  } = useForm({
    resolver: yupResolver(contactValidationSchema),
    mode: 'onChange',
  });

  const onSubmitCode = async (data) => {
    setIsLoading(true);
    try {
      // 서버 주소 추가 (로컬 환경에서는 http://localhost:3000)
      const response = await axios.post('http://localhost:3000/api/validate-code', { code: data.code });
  
      if (response.data.valid) {
        toast({
          title: 'GND vol.1에 초대되셨습니다',
          description: '이름과 전화번호를 입력해주세요',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setContactStatus('ready'); // 코드가 유효하면 'ready' 상태로 설정
        setValidatedCode(data.code.replace(/-/g, '')); // 유효한 코드 저장
      } else {
        toast({
          title: '유효하지 않은 코드',
          description: response.data.message || '입력하신 코드는 사용할 수 없습니다',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '코드 검증에 실패했습니다. 나중에 다시 시도해주세요.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  // 연락처 제출 핸들러
  const onSubmitContact = async (data) => {
    setIsLoading(true);
    try {
      // ex)
      const response = await axios.post('http://localhost:3000/api/submit-contact', { name: data.name, phone: data.phone, code: validatedCode });
      if (response.data.success) {
        setContactStatus('success');
      } else {
        setContactStatus('error');
        setContactMessage(response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 코드 입력 시 자동 하이픈 삽입
  const handleCodeInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const parts = value.match(/.{1,4}/g);
    setValueCode('code', parts ? parts.join('-') : '');
  };
  
  // 전화번호 입력 시 자동 하이픈 삽입
  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 3 && value.length <= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}-${value.slice(3, value.length - 4)}-${value.slice(-4)}`;
    }

    setValueContact('phone', value);
  };

  // 모든 입력이 성공적으로 완료되면, SuccessScreen
  if (contactStatus === 'success') {
    return <SuccessScreen />;
  }

  return (
    <VStack spacing={10} width="100%" align="center" justify="center" padding="20px">
      {/* 코드 검증 폼 */}
      {contactStatus !== 'ready' && (
        <form onSubmit={handleSubmitCode(onSubmitCode)} style={{ width: '100%', maxWidth: '400px' }}>
          <HStack spacing={4} width="100%" justify="center">
            <FormControl isInvalid={errorsCode.code}>
              <Input
                placeholder="XXXX-XXXX-XXXX-XXXX"
                {...registerCode('code')}
                onChange={handleCodeInput}
                maxLength={19} // 하이픈 포함 총 길이
                width="100%"
                bg="var(--Backgrounds-Primary, #FFF)"
                borderRadius="20px"
                border="1px solid var(--lightlight-Gray, #E8E8E8)"
                boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                fontFamily="Ubuntu Mono"
                aria-invalid={errorsCode.code ? 'true' : 'false'}
                _focus={{
                  borderColor: 'black',
                  boxShadow: '0 0 0 1px black',
                }}
              />
              <FormErrorMessage>
                {errorsCode.code && errorsCode.code.message}
              </FormErrorMessage>
            </FormControl>
            <IconButton
              ml="-2"
              aria-label="Confirm code"
              icon={isLoading ? <Spinner size="sm" /> : <ArrowForwardIcon boxSize="24px" />}
              bg="black"
              color="white"
              type="submit"
              size="md"
              borderRadius="full"
              boxShadow="0px 0px 10px 3px rgba(0, 0, 0, 0.25)"
              _hover={{ bg: 'gray.700', transform: 'scale(1.05)' }}
              _active={{ bg: 'gray.800' }}
              isLoading={isLoading}
            />
          </HStack>
        </form>
      )}

      {/* 연락처 입력 폼 */}
      {contactStatus === 'ready' && (
        <form onSubmit={handleSubmitContact(onSubmitContact)} style={{ width: '100%', maxWidth: '400px' }}>
          <VStack spacing={6} width="100%" justify="center">
            <FormControl isInvalid={errorsContact.name}>
              <Input
                {...registerContact('name')}
                placeholder="Your Name"
                maxLength={50}
                width="100%"
                bg="var(--Backgrounds-Primary, #FFF)"
                borderRadius="20px"
                border="1px solid var(--lightlight-Gray, #E8E8E8)"
                boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                fontFamily="Ubuntu Mono"
                aria-invalid={errorsContact.name ? 'true' : 'false'}
              />
              <FormErrorMessage>
                {errorsContact.name && errorsContact.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errorsContact.phone}>
              <Input
                {...registerContact('phone')}
                placeholder="Phone Number XXX-XXX(X)-XXXX"
                onChange={handlePhoneInput}
                maxLength={13}
                width="100%"
                bg="var(--Backgrounds-Primary, #FFF)"
                borderRadius="20px"
                border="1px solid var(--lightlight-Gray, #E8E8E8)"
                boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                fontFamily="Ubuntu Mono"
                aria-invalid={errorsContact.phone ? 'true' : 'false'}
              />
              <FormErrorMessage>
                {errorsContact.phone && errorsContact.phone.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              bg="black"
              color="white"
              width="100%"
              borderRadius="20px"
              boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
              isLoading={isLoading}
            >
              제출
            </Button>
          </VStack>
        </form>
      )}

      {/* 오류 메시지 */}
      {contactStatus === 'error' && (
        <Alert status="error" width="100%" maxWidth="400px" borderRadius="lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{contactMessage}</AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      )}
    </VStack>
  );
};

export default InputCode;
