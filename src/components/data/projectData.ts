import gvgImage from '../../images/gvg.png'
import nqstvImage from '../../images/nqstv.png'
import nqstvImage1 from '../../images/nqstv1.png'
import nqstvImage2 from '../../images/nqstv2.png'
import nqstvImage3 from '../../images/nqstv3.png'
import campLandingImage from '../../images/camp-balong/landing.png'
import campWelcomeImage from '../../images/camp-balong/welcome.png'
import campAccommodationsImage from '../../images/camp-balong/accommodations.png'
import campBookingImage from '../../images/camp-balong/booking.png'
import campCmsImage from '../../images/camp-balong/cms.png'
import campAdminDashboardImage from '../../images/camp-balong/admindashboard.png'
import compLandingImage from '../../images/Comp/landing.png'
import compFirstPageImage from '../../images/Comp/firstpage.png'
import compErasImage from '../../images/Comp/eras.png'
import compLessonImage from '../../images/Comp/lesson.png'
import compInteractiveImage from '../../images/Comp/interactiveNextButtons.png'
import credifyLandingImage from '../../images/Credify/landing.png'
import credifyVaultToolImage from '../../images/Credify/vaultTool.png'
import credifyWhatWeStoreImage from '../../images/Credify/whatWeStore.png'
import credifyPricingImage from '../../images/Credify/pricing.png'
import credifyPaymentImage from '../../images/Credify/mop.png'
import credifyLoginImage from '../../images/Credify/logIn.png'
import credifyVaultEmptyImage from '../../images/Credify/userInterface.png'
import credifyVaultAccountsImage from '../../images/Credify/holding accounts.png'

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
    date: '2026 · OJT · Live',
    status: 'finished',
    role: 'Web Developer, Deployment',
    summary: 'Live company website deployed for a real business.',
    tags: ['Web', 'Deployment', 'Live',"Html","Css","Javascript"],
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
    date: '2026 · Client  · Live',
    status: 'finished',
    role: 'Web Developer, Designer',
    summary: 'A booking website for a camp/resort.',
    tags: ['Web', 'Booking', 'UI','React', "Javascript","Supabase"],
    details:
      'A booking-focused website that lets visitors browse the camp and reserve a stay online.',
    challenge:
      'Making the booking flow simple and clear while presenting the camp attractively.',
    solution:
      'Built a clean, responsive layout with an easy-to-follow booking section so guests can reserve without confusion.',
    images: [
      {
        src: campLandingImage,
        alt: 'Camp Ba-long booking website landing page preview',
        caption: 'Landing page',
      },
      {
        src: campWelcomeImage,
        alt: 'Camp Ba-long booking website welcome section preview',
        caption: 'Welcome section',
      },
      {
        src: campAccommodationsImage,
        alt: 'Camp Ba-long accommodations listing preview',
        caption: 'Accommodations listing',
      },
      {
        src: campBookingImage,
        alt: 'Camp Ba-long online booking flow preview',
        caption: 'Booking flow',
      },
      {
        src: campCmsImage,
        alt: 'Camp Ba-long content management system preview',
        caption: 'Content management system',
      },
      {
        src: campAdminDashboardImage,
        alt: 'Camp Ba-long admin dashboard preview',
        caption: 'Admin dashboard',
      },
    ],
    link: 'https://camp-ba-long.vercel.app/',
  },


  {
    name: 'GvG Variety Store',
    date: '2026 · Client · In progress',
    status: 'in-progress',
    role: 'Web Developer, Designer',
    summary: 'A storefront-style website for a local variety store.',
    tags: ['Web', 'E-commerce', 'UI','React', "Javascript",],
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
    tags: ['Web', 'Academic', 'Front-End','Html','Css','Javascript'],
    details:
      'A school project built to present the history and evolution of computers in an organized, readable web page.',
    challenge:
      'Structuring a lot of information into a clear, easy-to-follow layout.',
    solution:
      'Organized the content into sections with a simple, consistent layout so the information is easy to scan and read.',
    images: [
      {
        src: compLandingImage,
        alt: 'Computer History website landing page preview',
        caption: 'Landing page',
      },
      {
        src: compFirstPageImage,
        alt: 'Computer History website opening content page preview',
        caption: 'Opening page',
      },
      {
        src: compErasImage,
        alt: 'Computer History website computer eras timeline preview',
        caption: 'Computer eras timeline',
      },
      {
        src: compLessonImage,
        alt: 'Computer History website lesson content page preview',
        caption: 'Lesson content',
      },
      {
        src: compInteractiveImage,
        alt: 'Computer History website interactive navigation buttons preview',
        caption: 'Interactive navigation buttons',
      },
    ],
    link: 'https://computer-history-seven.vercel.app/'
  },
  {
    name: 'Credify (Saas) Template',
    date: 'Personal Project',
    status: 'in-progress',
    role: 'Web Developer, Designer',
    summary: 'A modern SaaS template for a Personal Credential vault.',
    tags: ['Web', 'SaaS', 'UI', 'React', 'TailwindCSS', 'JavaScript'],
    details:
      'A responsive template designed for a SaaS company to showcase their services and attract potential customers.',
    challenge:
      'Creating a template that is both visually appealing and functional across different devices and screen sizes.',
    solution:
      'Developed a flexible, mobile-first design that ensures the template looks great on any device while maintaining usability.',
    images: [
      {
        src: credifyLandingImage,
        alt: 'Credify SaaS template landing page preview',
        caption: 'Landing page',
      },
      {
        src: credifyVaultToolImage,
        alt: 'Credify feature grid showing the vault tools on offer',
        caption: 'Feature overview',
      },
      {
        src: credifyWhatWeStoreImage,
        alt: 'Credify encryption explainer and stored-data schema table',
        caption: 'How encryption and storage work',
      },
      {
        src: credifyPricingImage,
        alt: 'Credify pricing plans preview',
        caption: 'Pricing plans',
      },
      {
        src: credifyPaymentImage,
        alt: 'Credify checkout page with payment method options and order summary',
        caption: 'Checkout and payment methods',
      },
      {
        src: credifyLoginImage,
        alt: 'Credify vault unlock screen with master password field',
        caption: 'Vault unlock screen',
      },
      {
        src: credifyVaultEmptyImage,
        alt: 'Credify vault dashboard in its empty state',
        caption: 'Vault dashboard — empty state',
      },
      {
        src: credifyVaultAccountsImage,
        alt: 'Credify vault dashboard holding saved account credentials',
        caption: 'Vault holding saved accounts',
      },
    ],
  }
]
