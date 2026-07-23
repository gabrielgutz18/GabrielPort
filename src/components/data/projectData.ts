import gvgImage from '../../images/gvg.png'
import nqstvImage from '../../images/nqstv.png'
import nqstvImage1 from '../../images/nqstv1.png'
import nqstvImage2 from '../../images/nqstv2.png'
import nqstvImage3 from '../../images/nqstv3.png'

export type ProjectImage = {
  src: string
  alt: string
  caption: string
}

export type ProjectStatus = 'finished' | 'in-progress'

export type Project = {
  name: string
  date: string
  status: ProjectStatus
  role?: string
  summary: string
  tags: string[]
  details: string
  challenge?: string
  solution: string
  images: ProjectImage[]
  link?: string
}

export const projects: Project[] = [
  
  {
    name: 'NQSTV Website',
    date: '2026 · Live',
    status: 'finished',
    role: 'Web Developer, Deployment',
    summary: 'Live company website deployed for a real business.',
    tags: ['Web', 'Deployment', 'Live'],
    details:
      'A live company website built to present the business clearly, provide easy contact paths, and keep performance strong across desktop and mobile.',
    challenge:
      'Connecting a custom domain, keeping the page fast, and adding contact tools without making the site feel heavy.',
    solution:
      'Deployed through GitHub Pages with a custom domain, tuned the assets and layout, integrated EmailJS and Crisp chat, then verified with Lighthouse until the performance score stayed around 99.',
    images: [
      {
        src: nqstvImage,
        alt: 'NQSTV website homepage preview',
        caption: 'Live website homepage',
      },
      {
        src: nqstvImage1,
        alt: 'NQSTV website landing page preview',
        caption: 'Landing page',
      },
      {
        src: nqstvImage2,
        alt: 'NQSTV website welcome section preview',
        caption: 'Welcome Section',
      },
      {
        src: nqstvImage3,
        alt: 'NQSTV website projects carousel gallery preview',
        caption: 'Projects carousel gallery',
      },
    ],
    link: 'https://nqstv.net',
  },
  {
    name: 'Camp Ba-long Booking Website',
    date: '2026 · In Progress',
    status: 'in-progress',
    role: 'Web Developer, Designer',
    summary: 'A booking website for a camp/resort.',
    tags: ['Web', 'Booking', 'UI'],
    details:
      'A booking-focused website that lets visitors browse the camp and reserve a stay online.',
    challenge:
      'Making the booking flow simple and clear while presenting the camp attractively.',
    solution:
      'Built a clean, responsive layout with an easy-to-follow booking section so guests can reserve without confusion.',
    images: [],
  },


  {
    name: 'GvG Variety Store',
    date: 'In progress',
    status: 'in-progress',
    role: 'Web Developer, Designer',
    summary: 'A storefront-style website for a local variety store.',
    tags: ['Web', 'E-commerce', 'UI'],
    details:
      'A website concept for a local variety store to showcase products and make the shop easier to reach online.',
    challenge:
      'Designing a clean, easy-to-browse layout that can grow into a full catalog later.',
    solution:
      'Started with a responsive layout and reusable product sections so the store can expand its listings without a redesign. Currently a work in progress.',
    images: [
      {
        src: gvgImage,
        alt: 'GvG Variety Store website preview',
        caption: 'Storefront layout preview',
      },
    ],
  },
  {
    name: 'Computer History',
    date: 'School Project',
    status: 'finished',
    role: 'Developer',
    summary: 'An academic web project on the history of computers.',
    tags: ['Web', 'Academic'],
    details:
      'A school project built to present the history and evolution of computers in an organized, readable web page.',
    challenge:
      'Structuring a lot of information into a clear, easy-to-follow layout.',
    solution:
      'Organized the content into sections with a simple, consistent layout so the information is easy to scan and read.',
    images: [],
  },
]
