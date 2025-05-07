// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  /* 1) 전역 폰트 지정 */
  fonts: {
    heading: "'Galmuri11', sans-serif",  // 헤딩·버튼 등에 Galmuri 우선 적용
    body: "'Galmuri11', 'NotoSans', sans-serif", // 본문도 Galmuri 우선 + NotoSans fallback
    mono: "'UbuntuMono', monospace",
    noto: "'NotoSans', sans-serif",
  },

  /* 2) @font-face 선언 */
  styles: {
    global: {
      '@font-face': [
        {
          fontFamily: 'Galmuri11',
          src: `url("/fonts/Galmuri11.ttf") format("truetype")`,
          fontStyle: 'normal',
          fontWeight: 'normal',
        },
        {
          fontFamily: 'UbuntuMono',
          src: `url("/fonts/UbuntuSansMono-VariableFont_wght.ttf") format("truetype")`,
          fontStyle: 'normal',
        },
        {
          fontFamily: 'NotoSans',
          src: `url("/fonts/NotoSansKR-VariableFont_wght.ttf") format("truetype")`,
          fontStyle: 'normal',
        },
      ],

      /* 3) 기본 바디 스타일 */
      body: {
        margin: 0,
        padding: 0,
        backgroundColor: '#f2f2f2',
        fontFamily: "'Galmuri11', 'NotoSans', sans-serif",
      },
    },
  },
});

export default theme;
