// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: "'UbuntuMono', monospace",
    body: "'UbuntuMono', monospace",
  },
  styles: {
    global: {
      "@font-face": {
        fontFamily: "UbuntuMono",
        src: `url("/fonts/UbuntuSansMono-VariableFont_wght.ttf") format("truetype")`,
        fontStyle: "normal",
      },
      body: {
        margin: 0,
        padding: 0,
        backgroundColor: "#f5f5f5",
        fontFamily: "'UbuntuMono', monospace",
      },
    },
  },
});

export default theme;
