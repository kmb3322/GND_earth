// =========================
//  SuccessScreen.jsx
// =========================
import { Text, VStack } from '@chakra-ui/react';

const SuccessScreen = ({ name, ticketNo }) => (
  <VStack spacing={10} align="center" mt={10}>
    <VStack spacing={6} width="100%" align="center">
      <Text
        fontFamily="Galmuri11"
        fontWeight="bold"
        fontSize="17px"
        textAlign="center"
      >
        {name}님,
      </Text>

      <Text
        fontFamily="Galmuri11"
        fontWeight="bold"
        fontSize="17px"
        mt="-12px"
        textAlign="center"
      >
        SAD GAS X GND에 오신 것을<br />환영합니다.
      </Text>

      {ticketNo && (
        <Text fontFamily="noto" fontSize="15px" mt="4px" textAlign="center">
          {name}님의<br />SAD GAS X GND raffle 추첨 번호는<br />
          <b>{ticketNo}</b>번입니다.<br /><br />
          추첨 번호가 띄워진 본 화면을<br />당일 STAFF에게 보여주시면 됩니다.
        </Text>
      )}

      <Text
        fontFamily="noto"
        fontSize="12px"
        mt="10px"
        textAlign="center"
      >
        세부 안내가 문자로 발송될 예정입니다.
      </Text>
    </VStack>

    <Text mb="20px"></Text>
  </VStack>
);

export default SuccessScreen;
