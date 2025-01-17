import { link } from "fs";

interface CardProps {
   title: string,
   src: string,
   right: string,
   left: string
   link: string
}

interface CreativeArrayProps {
   name: string,
   bDay: string,
   description: string,
   imageSrc: string,
   imageBg: string,
   fbLink: string,
   instaLink: string,
   email: string,
   address: string,
}

export const Alphabet = [
   "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
]

export const ServiceArray = [
   {
      id: 1,
      name: 'Alro John Mercado',
      bDay: '2001-12-24', //yyyy/mm/dd
      description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA.",
      imageSrc: "/images/creative-directory/profile.jpg",
      imageBg: "",
      fbLink: "",
      instaLink: "",
      email: "",
      address: "Salvacion Tabaco City",
   },
   {
      id: 2,
      name: 'Alro John Mercado',
      bDay: '2001-12-24', //yyyy/mm/dd
      description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA.",
      imageSrc: "/images/creative-directory/profile.jpg",
      imageBg: "",
      fbLink: "",
      instaLink: "",
      email: "",
      address: "Salvacion Tabaco City",
   },
   {
      id: 3,
      name: 'Alro John Mercado',
      bDay: '2001-12-24', //yyyy/mm/dd
      description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA.",
      imageSrc: "/images/creative-directory/profile.jpg",
      imageBg: "",
      fbLink: "",
      instaLink: "",
      email: "",
      address: "Salvacion Tabaco City",
   },
   {
      id: 4,
      name: 'Alro John Mercado',
      bDay: '2001-12-24', //yyyy/mm/dd
      description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA.",
      imageSrc: "/images/creative-directory/profile.jpg",
      imageBg: "",
      fbLink: "",
      instaLink: "",
      email: "",
      address: "Salvacion Tabaco City",
   },
   {
      id: 5,
      name: 'Alro John Mercado',
      bDay: '2001-12-24', //yyyy/mm/dd
      description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA.",
      imageSrc: "/images/creative-directory/profile.jpg",
      imageBg: "",
      fbLink: "",
      instaLink: "",
      email: "",
      address: "Salvacion Tabaco City",
   },
   {
      id: 6,
      name: 'Alro John Mercado',
      bDay: '2001-12-24', //yyyy/mm/dd
      description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA.",
      imageSrc: "/images/creative-directory/profile.jpg",
      imageBg: "",
      fbLink: "",
      instaLink: "",
      email: "",
      address: "Salvacion Tabaco City",
   },

];

export const TopCreatives = [
   {
       id: 1,
       name: "Sean Palacay",
       src: "/images/creative-directory/profile.jpg",
       description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA."
   },
   {
       id: 2,
       name: "Sean Palacay",
       src: "/images/creative-directory/profile.jpg",
       description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA."
   },
   {
       id: 3,
       name: "Sean Palacay",
       src: "/images/creative-directory/profile.jpg",
       description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA."
   },
   {
       id: 4,
       name: "Angel Nacion",
       src: "/images/creative-directory/profile.jpg",
       description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA."
   },
   {
       id: 5,
       name: "Angel Nacion",
       src: "/images/creative-directory/profile.jpg",
       description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA."
   },
   {
       id: 6,
       name: "Angel Nacion",
       src: "/images/creative-directory/profile.jpg",
       description: "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA."
   },
]