// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: "'UbuntuMono', monospace", // 기본 헤딩 폰트
    body: "'NotoSans', sans-serif",      // 기본 바디 폰트
    mono: "'UbuntuMono', monospace",     // 코드 블록 등에서 사용할 수 있는 모노 폰트
    noto: "'NotoSans', sans-serif",      // 추가로 사용할 수 있는 NotoSans 폰트
  },
  styles: {
    global: {
      "@font-face": [
        {
          fontFamily: "UbuntuMono",
          src: `url("/fonts/UbuntuSansMono-VariableFont_wght.ttf") format("truetype")`,
          fontStyle: "normal",
        },
        {
          fontFamily: "NotoSans",
          src: `url("/fonts/NotoSansKR-VariableFont_wght.ttf") format("truetype")`,
          fontStyle: "normal",
        },
      ],
      body: {
        margin: 0,
        padding: 0,
        backgroundColor: "#f2f2f2",
        fontFamily: "'NotoSans', sans-serif", // 기본 바디 폰트 설정
      },
    },
  },
});

export default theme;
