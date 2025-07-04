// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  /* 1) 전역 폰트 지정 */
  fonts: {
    heading: "'Galmuri11', sans-serif",
    body: "'Galmuri11', 'NotoSans', sans-serif",
    mono: "'UbuntuMono', monospace",
    noto: "'NotoSans', sans-serif",
  },

  /* 2) @font-face 선언 및 기본 바디 스타일 */
  styles: {
    global: {
      '@font-face': [
        {
          fontFamily: 'Galmuri11',
          src: `
            url("/fonts/Galmuri11.woff2") format("woff2"),
            url("/fonts/Galmuri11.ttf")  format("truetype")
          `,
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontDisplay: 'swap',
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
      body: {
        margin: 0,
        padding: 0,
        backgroundColor: '#f2f2f2',
        fontFamily: "'Galmuri11', 'NotoSans', sans-serif",
      },
    },
  },

  /* 3) Toast 컴포넌트 색상 오버라이드 */
  components: {
    Alert: {
      baseStyle: (props) => ({
        container: {
          bg: props.status === 'error' ? 'red.700' : undefined,
          color: props.status === 'error' ? 'white' : undefined,
          fontFamily: 'noto',
        },
         FormError: {
          baseStyle: {
            text: {
              fontFamily: 'noto',
              fontSize: '12px',
              fontWeight: 500,
            },
          },
        },
      }),
    },
  },
});

export default theme;
