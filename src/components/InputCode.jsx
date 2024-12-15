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
  Select,
  Spinner,
  useToast,
  VStack
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import SuccessScreen from './SuccessScreen';

const InputCode = () => {
  const [contactStatus, setContactStatus] = useState(null); 
  const [contactMessage, setContactMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validatedCode, setValidatedCode] = useState(''); 
  const [submittedName, setSubmittedName] = useState(''); 

  const [isCodeFocused, setIsCodeFocused] = useState(false); // code 인풋 focus 상태

  const toast = useToast();

  // 코드 검증 스키마
  const codeValidationSchema = Yup.object().shape({
    code: Yup.string()
      .required('16자리 초대 코드를 입력해주세요.')
      .matches(/^(\d{4}-){3}\d{4}$/, '코드를 XXXX-XXXX-XXXX-XXXX 형식으로 입력해주세요.'),
  });

  // 연락처 제출 스키마 (interest 필드 포함)
  const contactValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required('이름을 입력해주세요.')
      .max(50, '이름은 최대 50자까지 입력할 수 있습니다.'),
    phone: Yup.string()
      .required('전화번호를 입력해주세요.')
      .matches(/^\d{3}-\d{3,4}-\d{4}$/, '전화번호를 XXX-XXX(X)-XXXX 형식으로 입력해주세요.'),
    interest: Yup.string()
      .required('관심사를 선택해주세요.')
      .oneOf(['sound', 'visual', 'general'], '유효한 관심사를 선택해주세요.'),
  });

  // 코드 검증 폼 관리
  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: errorsCode },
    setValue: setValueCode,
    watch: watchCodeForm
  } = useForm({
    resolver: yupResolver(codeValidationSchema),
    mode: 'onChange',
  });

  // 현재 code 값 감지
  const codeValue = watchCodeForm('code', '');

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
      const response = await axios.post('https://gnd-back.vercel.app/api/validate-code', { code: data.code });
      
      if (response.data.valid) {
        toast({
          title: 'GND vol.1에 초대되셨습니다',
          description: '이름, 전화번호, 관심사를 입력해주세요',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setContactStatus('ready');
        setValidatedCode(data.code.replace(/-/g, ''));
      } else {
        toast({
          title: '유효하지 않은 코드',
          description: '코드를 잘못 입력하셨거나, 이미 사용된 코드입니다.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      if (error.response) {
        console.error('Response Error:', error.response);
        toast({
          title: '코드 오류',
          description: `${error.response.data.message || error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.request) {
        console.error('Request Error:', error.request);
        toast({
          title: '네트워크 오류',
          description: '서버에 연결할 수 없습니다. 나중에 다시 시도해주세요.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error('Error:', error.message);
        toast({
          title: '알 수 없는 오류',
          description: '예기치 못한 오류가 발생했습니다. 다시 시도해주세요.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitContact = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://gnd-back.vercel.app/api/submit-contact', {
        name: data.name,
        phone: data.phone,
        code: validatedCode,
        interest: data.interest,
      });
  
      if (response.data.success) {
        setSubmittedName(data.name);
        setContactStatus('success');
      } else {
        setContactStatus('error');
        setContactMessage(response.data.message || '알 수 없는 오류 발생');
      }
    } catch (error) {
      setContactStatus('error');
      setContactMessage('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
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

  // 포커스 상태와 codeValue를 바탕으로 placeholder 결정
  const codePlaceholder = (isCodeFocused && codeValue.length === 0) ? "XXXX-XXXX-XXXX-XXXX" : "";

  if (contactStatus === 'success') {
    return <SuccessScreen name={submittedName} />;
  }

  return (
    <VStack spacing={10} width="100%" align="center" justify="center" padding="20px">
      {/* 코드 검증 폼 */}
      {contactStatus !== 'ready' && (
        <form onSubmit={handleSubmitCode(onSubmitCode)} style={{ width: '100%', maxWidth: '400px' }}>
          <HStack spacing={4} width="100%" justify="center">
            <FormControl isInvalid={errorsCode.code}>
              <Input
                placeholder={codePlaceholder}
                {...registerCode('code')}
                onChange={handleCodeInput}
                onFocus={() => setIsCodeFocused(true)}
                onBlur={() => setIsCodeFocused(false)}
                maxLength={19}
                width="100%"
                bg="var(--Backgrounds-Primary, #FFF)"
                borderRadius="20px"
                border="1px solid var(--lightlight-Gray, #E8E8E8)"
                boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                fontFamily="UbuntuMono"
                aria-invalid={errorsCode.code ? 'true' : 'false'}
                _placeholder={{
                  fontFamily: "UbuntuMono",  
                  fontSize: '15px',
                  color: 'gray.500',
                  fontWeight: '400',
                  letterSpacing: '-0.5px',
                }}
                _focus={{
                  fontFamily: "UbuntuMono", 
                  fontSize: '15px',
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
                _placeholder={{
                  fontFamily: "UbuntuMono",  
                  fontSize: '12px',                   
                  color: 'gray.500',                 
                  fontWeight: '400',                  
                  letterSpacing: '-0.5px',             
                }}
                maxLength={50}
                width="100%"
                bg="var(--Backgrounds-Primary, #FFF)"
                borderRadius="20px"
                border="1px solid var(--lightlight-Gray, #E8E8E8)"
                boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                color="black"
                fontWeight="400"
                letterSpacing="-0.5px"
                aria-invalid={errorsContact.name ? 'true' : 'false'}
              />
              <FormErrorMessage>
                {errorsContact.name && errorsContact.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errorsContact.phone}>
              <Input
                {...registerContact('phone')}
                placeholder="Phone Number"
                _placeholder={{
                  fontFamily: "UbuntuMono",  
                  fontSize: '12px',                   
                  color: 'gray.500',                 
                  fontWeight: '400',                  
                  letterSpacing: '-0.5px',             
                }}
                onChange={handlePhoneInput}
                maxLength={13}
                width="100%"
                bg="var(--Backgrounds-Primary, #FFF)"
                borderRadius="20px"
                border="1px solid var(--lightlight-Gray, #E8E8E8)"
                boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                color="black"
                fontWeight="400"
                letterSpacing="-0.5px"
                aria-invalid={errorsContact.phone ? 'true' : 'false'}
              />
              <FormErrorMessage>
                {errorsContact.phone && errorsContact.phone.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errorsContact.interest}>
              <Select
                {...registerContact('interest')}
                fontSize="12px"
                color="black"
                fontWeight="400"
                letterSpacing="-0.5px"
                placeholder="Select your interest"
                _placeholder={{
                  fontFamily: "UbuntuMono",  
                  fontSize: '12px',                   
                  color: 'gray.500',                 
                  fontWeight: '400',                  
                  letterSpacing: '-0.5px',             
                }}
                bg="var(--Backgrounds-Primary, #FFF)"
                borderRadius="20px"
                border="1px solid var(--lightlight-Gray, #E8E8E8)"
                boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                fontFamily="UbuntuMono"
                _focus={{
                  fontFamily: "UbuntuMono",  
                  color: 'black',                 
                  fontWeight: '400',                  
                  letterSpacing: '-0.5px',
                }}
              >
                <option value="sound">Sound</option>
                <option value="visual">Visual</option>
                <option value="general">General</option>
              </Select>
              <FormErrorMessage>
                {errorsContact.interest && errorsContact.interest.message}
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
              _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
              _active={{ bg: 'gray.800' }}
            >
              GND vol.1 참가하기
            </Button>
          </VStack>
        </form>
      )}

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
