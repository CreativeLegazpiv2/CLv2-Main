import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          1: "#FFD094", //khaki
          2: "#403737", //brown
          3: "#fa8811" //orange
        },
        secondary: {
          1: "#FFFFFF", //white for text
          2: "#000000", //black for text
        },
        tertiary: {
          1: "#B6E3CE", //green-shade
          2: "#DCE5A5", //yellow-green-shade
          3: "#FFD09", //orange-shade
          4: "#FA897B", //red-shade
          5: "#CCA5CE", //violet-shade
          6: "#54136C", //violet color
        },
        quaternary: {
          1: "#695C5C", //brown-90%
          2: "#E0E0E0", //gray shade
        },
        shade: {
          1: "#F19D55", //orange-shade
          2: "#B6E3CE", //green-shade
          3: "#1b7a8e", //green-shade button
          4: "#54136C", //violet shade button
          5: "#CCA5CE", //violet shade
          6: "#F0E7E7", //white-shade
          7: "#BEACAC", //brown-shade
          8: "#FFE3BF", //brown-shade
          9: "#FAEFD3", //brown-shade scoll-bar tracking line
        },

        newColor: {
          //ADD NEW COLOR HERE do not insert new color for the color above is already used, 
          //changing the number will create error or change other component design change
        },

      },
      boxShadow:{
        "customShadow": '5px 5px 5px 0px rgba(0, 0, 0, 0.3)'
      }

    },
  },
  plugins: [],
};
export default config;
