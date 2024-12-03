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
      description: 'Our creative services offer a wide range of solutions tailored to your brand’s needs, helping you craft compelling campaigns and experiences. From initial concept to final execution, we ensure that each project resonates with your audience and meets your strategic goals.',
      src: '/images/creative-directory/1.png',
      right: 'right-5',
      left: '',
      translate: '',
      link: '/apps-ui/services/creative-services'
   },
   {
      id: 2,
      title: 'DIGITAL INTERACTIVE MEDIA',
      description: 'Transform your digital presence with interactive media that drives user engagement and enhances the online experience. Our team specializes in creating immersive digital content, including websites, applications, and multimedia experiences, tailored to captivate your audience.',
      src: '/images/creative-directory/2.png',
      right: '',
      left: '-left-5',
      translate: '',
      link: '/apps-ui/services/digital-interactive-media'
   },
   {
      id: 3,
      title: 'AUDIOVISUAL MEDIA',
      description: 'Create powerful audiovisual content that captures attention and communicates your message clearly. Whether it is for advertising, training, or entertainment, our audiovisual media services deliver professional-grade content that engages and informs your audience.',
      src: '/images/creative-directory/3.png',
      right: '-right-0',
      left: '',
      translate: '',
      link: '/apps-ui/services/audiovisual-media'
   },
   {
      id: 4,
      title: 'DESIGN',
      description: 'Our design services encompass a wide range of creative solutions, from brand identity to user interfaces. We focus on creating visually stunning, functional designs that connect with your audience while aligning with your brand’s core values and goals.',
      src: '/images/creative-directory/4.png',
      right: '-right-0',
      left: '',
      translate: '',
      link: '/apps-ui/services/design'
   },
   {
      id: 5,
      title: 'PUBLISHING AND PRINTING MEDIA',
      description: 'Our publishing and printing services deliver high-quality content, both digital and physical, to help your message reach the right audience. We provide end-to-end solutions, including layout design, production, and distribution, ensuring your content makes an impact.',
      src: '/images/creative-directory/5.png',
      right: '-right-0',
      left: '',
      translate: '',
      link: '/apps-ui/services/publishing-and-printing-media'
   },
   {
      id: 6,
      title: 'PERFORMING ARTS',
      description: 'Bring your artistic vision to life with our professional performing arts services. We specialize in producing captivating performances, from theater productions to live events, with a focus on creativity, artistic direction, and seamless execution.',
      src: '/images/creative-directory/6.png',
      right: '',
      left: 'left-1/2',
      translate: '-translate-x-[50%]',
      link: '/apps-ui/services/performing-arts'
   },
   {
      id: 7,
      title: 'VISUAL ARTS',
      description: 'Our visual arts services include everything from fine arts to graphic design, offering unique artistic solutions for various creative needs. Whether you are looking to enhance your branding or create a one-of-a-kind piece of artwork, we provide the expertise and creativity to bring your ideas to life.',
      src: '/images/creative-directory/7.png',
      right: '-right-0',
      left: 'left-1/2',
      translate: '-translate-x-[50%]',
      link: '/apps-ui/services/visual-arts'
   },
   {
      id: 8,
      title: 'TRADITIONAL AND CULTURAL EXPRESSIONS',
      description: 'Preserve and promote cultural heritage through traditional and cultural expressions, including the arts, crafts, and performances. Our services focus on celebrating cultural diversity and providing platforms to showcase the richness of heritage through creative mediums.',
      src: '/images/creative-directory/8.png',
      right: '',
      left: 'left-1/2',
      translate: '-translate-x-[50%]',
      link: '/apps-ui/services/traditional-and-cultural-expressions'
   },
   {
      id: 9,
      title: 'CULTURAL SITES',
      description: 'Highlight and protect cultural sites with creative services that showcase their historical and cultural significance. We provide innovative solutions for promoting these sites, using storytelling, digital media, and immersive experiences to engage visitors and preserve their heritage.',
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