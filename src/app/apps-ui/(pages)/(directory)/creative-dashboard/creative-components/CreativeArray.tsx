import { link } from "fs";

interface CardProps {
   title: string,
   src: string,
   right: string,
   left: string
   link: string
}

export interface CreativeUser {
   detailsid: number;
   first_name: string;
   bday: string;
   bio: string;
   profile_pic: string;
   imageBg: string;
}


export const CreativeArray = [
   {
      id: 1,
      title: 'Creative services',
      src: '/images/creative-directory/1.png',
      right: 'right-5',
      left: '',
      translate: '',
      link: '/apps-ui/services/creative-services'
   },
   {
      id: 2,
      title: 'DIGITAL INTERACTIVE MEDIA',
      src: '/images/creative-directory/2.png',
      right: '',
      left: '-left-5',
      translate: '',
      link: '/apps-ui/services/digital-interactive-media'
   },
   {
      id: 3,
      title: 'AUDIOVISUAL MEDIA',
      src: '/images/creative-directory/3.png',
      right: '-right-0',
      left: '',
      translate: '',
      link: '/apps-ui/services/audiovisual-media'
   },
   {
      id: 4,
      title: 'DESIGN',
      src: '/images/creative-directory/4.png',
      right: '-right-0',
      left: '',
      translate: '',
      link: '/apps-ui/services/design'
   },
   {
      id: 5,
      title: 'PUBLISHING AND PRINTING MEDIA',
      src: '/images/creative-directory/5.png',
      right: '-right-0',
      left: '',
      translate: '',
      link: '/apps-ui/services/publishing-and-printing-media'
   },
   {
      id: 6,
      title: 'PERFORMING ARTS',
      src: '/images/creative-directory/6.png',
      right: '',
      left: 'left-1/2',
      translate: '-translate-x-[50%]',
      link: '/apps-ui/services/performing-arts'
   },
   {
      id: 7,
      title: 'VISUAL ARTS',
      src: '/images/creative-directory/7.png',
      right: '-right-0',
      left: 'left-1/2',
      translate: '-translate-x-[50%]',
      link: '/apps-ui/services/visual-arts'
   },
   {
      id: 8,
      title: 'TRADITIONAL AND CULTURAL EXPRESSIONS',
      src: '/images/creative-directory/8.png',
      right: '',
      left: 'left-1/2',
      translate: '-translate-x-[50%]',
      link: '/apps-ui/services/traditional-and-cultural-expressions'
   },
   {
      id: 9,
      title: 'CULTURAL SITES',
      src: '/images/creative-directory/9.png',
      right: '',
      left: 'left-1/2',
      translate: '-translate-x-[50%]',
      link: '/apps-ui/services/cultural-sites'
   },
];


export const CreativeService = {
   async fetchCreativeUsers(): Promise<CreativeUser[]> {
       try {
           const response = await fetch('/api/fetchUsers');
           if (!response.ok) {
               throw new Error("Failed to fetch creative users");
           }
           return await response.json();
       } catch (error) {
           console.error("Error fetching creative users:", error);
           return [];
       }
   }
};