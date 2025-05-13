// RegistrationForm.jsx
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  Input,
  Link,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaInstagram } from 'react-icons/fa';
import * as Yup from 'yup';

/* ===== RegistrationForm ===== */
const RegistrationForm = ({ onSuccess, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  /* yup validation */
  const schema = Yup.object().shape({
    name: Yup.string().required('이름을 입력해주세요.').max(50, '최대 50자까지 입력 가능합니다.'),
    phone: Yup.string()
      .required('전화번호를 입력해주세요.')
      .matches(/^\d{3}-\d{3,4}-\d{4}$/, 'XXX-XXXX-XXXX 형식으로 입력해주세요.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

  /* 전화번호 자동 하이픈 */
  const handlePhone = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 3 && val.length <= 6) val = `${val.slice(0, 3)}-${val.slice(3)}`;
    else if (val.length > 6) val = `${val.slice(0, 3)}-${val.slice(3, val.length - 4)}-${val.slice(-4)}`;
    setValue('phone', val, { shouldValidate: true });
  };

  /* 제출 */
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://gnd-back.vercel.app/api/register',
        { name: data.name, phone: data.phone },
        { timeout: 12000 } // 15 초 타임아웃
      );

      if (res.data.success) {
        onSuccess(data.name);
      } else {
        toast({
          status: 'error',
          title: res.data.message || '알 수 없는 오류 발생',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED';
      toast({
        status: 'error',
        title: isTimeout
          ? '네트워크 연결 오류'
          : '네트워크 연결 오류',
        description: isTimeout ? '잠시 후 다시 시도해주세요.' : err.response?.data?.message,
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* 투명 회색 Input 공통 스타일 */
  const inputStyle = {
    fontFamily: 'noto',
    fontSize: '12px',
    bg: 'whiteAlpha.100',
    _placeholder: { color: 'whiteAlpha.500' },
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '20px',
    boxShadow: '0 0 10px 1px rgba(0,0,0,0.25)',
    color: 'whiteAlpha.900',
    fontWeight: 400,
    letterSpacing: '-0.5px',
  };

  return (
    <VStack spacing={10} w="100%" align="center" justify="center" p="20px" mt={10}>
      {/* ─── 닫기 버튼 ─── */}
      <IconButton
        aria-label="닫기"
        icon={<Text fontFamily="Galmuri11" fontSize="28px">×</Text>}
        variant="ghost"
        position="absolute"
        color="whiteAlpha.600"
        top="12px"
        right="12px"
        _hover={{ color: 'whiteAlpha.900' }}
        _active={{ color: 'whiteAlpha.500' }}
        onClick={onClose}
      />

      {/* 타이틀 */}
      <Text color="whiteAlpha.900" fontFamily="Galmuri11" fontSize="24px" mb={-8}>
        SAD GAS X GND
      </Text>
      <Text color="whiteAlpha.900" fontFamily="Galmuri11" fontSize="12px" mb={-8}>
        05 24 2025
      </Text>

      {/* 안내 문구 */}
      <VStack spacing={2}>
        <Text fontFamily="noto" fontSize="12px" color="gray.300" textAlign="center">
          입력해주신 연락처로 1~2일 내 안내 문자가 발송될 예정입니다.
        </Text>
      </VStack>

      {/* 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '400px' }}>
        <VStack spacing={6}>
          {/* 이름 */}
          <FormControl isInvalid={errors.name}>
            <Input placeholder="이름" {...register('name')} {...inputStyle} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          {/* 전화번호 */}
          <FormControl isInvalid={errors.phone}>
            <Input
              placeholder="전화번호"
              {...register('phone')}
              onChange={handlePhone}
              maxLength={13}
              {...inputStyle}
            />
            <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
          </FormControl>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            bg="rgb(160,13,13)"
            fontFamily="mono"
            fontWeight="700"
            fontSize="14px"
            color="white"
            w="100%"
            letterSpacing={6}
            borderRadius="20px"
            opacity={0.8}
            boxShadow="0 0 10px 1px rgba(0,0,0,0.25)"
            isLoading={isLoading}
            _hover={{ bg: 'rgb(180, 33, 33)', transform: 'scale(1.02)' }}
            _active={{ bg: 'rgb(120, 10, 10)' }}
          >
            참가하기
          </Button>
        </VStack>
      </form>

      {/* 주소 & 인스타 & 연락처 */}
      <VStack spacing={2} mt={0}>
        <Link href="https://instagram.com/revengeseoul" isExternal color="gray.400">
          <Text color="gray.300" fontFamily="Galmuri11" fontSize="sm" textAlign="center">
            서울 용산구 이태원로 173-7 REVENGE
          </Text>
        </Link>

        <Link href="https://instagram.com/gnd_earth" isExternal color="gray.400">
          <Flex align="center">
            <Icon as={FaInstagram} mr={1} />
            <Text>gnd_earth</Text>
          </Flex>
        </Link>

        <Link href="tel:010-8288-3951" _hover={{ textDecor: 'none' }}>
          <Text color="gray.400" fontFamily="noto" fontSize="10px" textAlign="center">
            문의&nbsp;010-8288-3951
          </Text>
        </Link>
      </VStack>
    </VStack>
  );
};

export default RegistrationForm;
