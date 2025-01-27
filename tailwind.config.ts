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
        palette:{
          1: "#6E352C", //maroon
          2: "#CE5230", //scarlet
          3: "#F49A44", //orange
          4: "#E4C597", //cream
          5: "#FAF3E1", //white
          6: "#6E602F", //olive
          7: "#222222", //black
        },
        new: {
          /* SCSS HEX */
          1: "#914F1E",
          2: "#DEAC80",
          3: "#403737",
          4: "#F7DCB9",
          5: "#4B5945",
           /* SCSS HEX */
          //  1: "#D398A6ff",
          //  2: "#DA8CA2",
          //  3: "#BC3D68",
          //  4: "#C55375",
          //  5: "#CE6E8A",
        },
        gradient:{
          1: "#A845E6",
          2: "#FAAD37",
          3: "#6F82D8",
          4: "#B5F59A",
          5: "#9364E0",
          6: "#7ECFE1",
          7: "#99B20F",
          8: "#D2E357",
          9: "#F99E9F",
          10: "#8B58E8",
          11: "#E25E20",
          12: "#F2C65E",
          13: "#D13977",
          14: "#F2C65E",
          15: "#DB429B",
          16: "#81CFCB",
          17: "#D78E40",
          18: "#F4EA8E",
        }

      },
      boxShadow: {
        "customShadow": '5px 5px 5px 0px rgba(0, 0, 0, 0.3)',
        "customShadow2": '5px 5px 5px 0px rgba(0, 0, 0, 0.6)',
        "customShadow3": '5px 5px 10px 15px rgba(0, 0, 0, 0.3)',
      },
      dropShadow: {
        'custom': '5px 0px 20px rgba(0, 0, 0, 0.80)',
      }
    },
  },
  plugins: [],
};
export default config;
