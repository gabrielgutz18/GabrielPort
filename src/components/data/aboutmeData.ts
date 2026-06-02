import {
  Code2,
  Cpu,
  GitBranch,
  Globe2,
  Network,
  Palette,
  Server,
  type LucideIcon,
} from 'lucide-react'
import cert1 from '../../images/Cert/Cisco_cert.jpg'
import cert2 from '../../images/Cert/AIVA.jpg'
import cert3 from '../../images/Cert/cpe.jpg'
import cert4 from '../../images/Cert/Cert_gutierrez_20251217_094037_0000.png'
import cert5 from '../../images/Cert/Customer.jpg'
import cert6 from '../../images/Cert/Gutierrez Cert.jpg'
import cert7 from '../../images/Cert/IOT.jpg'
import cert8 from '../../images/Cert/PLC.jpg'
import cert9 from '../../images/Cert/PCB.png'
import cert10 from '../../images/Cert/ccna.png'
import cert11 from '../../images/Cert/sddt.png'
import cert12 from '../../images/Cert/serverless.png'
import hobby1 from '../../assets/svgs/coding-code-svgrepo-com.svg'
import hobby2 from '../../assets/svgs/coffee-cup-svgrepo-com.svg'
import hobby3 from '../../assets/svgs/d-pad-svgrepo-com.svg'
import hobby4 from '../../assets/svgs/music-svgrepo-com (1).svg'
import hobby5 from '../../assets/svgs/paint-svgrepo-com.svg'
import hobby6 from '../../assets/svgs/running-svgrepo-com.svg'

export type AboutSkill = {
  label: string
  Icon: LucideIcon
}

export type Build = {
  title: string
  description: string
  Icon: LucideIcon
  tone: 'neutral' | 'cool' | 'warm'
  href?: string
}

export type Webinar = {
  title: string
  description: string
  image: string
}

export const aboutSkills: AboutSkill[] = [
  { label: 'Web dev', Icon: Globe2 },
  { label: 'NAS / Servers', Icon: Server },
  { label: 'Drone AI', Icon: Cpu },
  { label: 'Networking', Icon: Network },
  { label: 'Design', Icon: Palette },
  { label: 'Python / JS', Icon: Code2 },
  { label: 'Git / GitHub', Icon: GitBranch },
  { label: 'IT Support', Icon: Network },
  { label: 'Graphics designing', Icon: Palette },
]

export const stats = [
  { value: '99', label: 'Lighthouse performance score' },
  { value: '4TB + 500GB', label: 'NAS storage configured, TailScale VPN deployed' },
  { value: '1', label: 'Live company website deployed' },
]

export const builds: Build[] = [
  {
    title: 'nqstv.net - Live company website',
    description:
      'Full-stack deployment via GitHub Pages, custom domain, EmailJS, Crisp chat, and a 99% Lighthouse score.',
    Icon: Globe2,
    tone: 'neutral',
    href: 'https://nqstv.net',
  },
  {
    title: 'Search-and-rescue drone system',
    description:
      'YOLOv8 AI detection, thermal camera, LiDAR obstacle avoidance, GPS accuracy, and RTH fail-safe.',
    Icon: Cpu,
    tone: 'cool',
  },
  {
    title: 'TrueNAS server + remote access',
    description:
      'ZFS RAID-1 storage, Tailscale VPN, and a 2.5G NIC upgrade for faster transfer speeds.',
    Icon: Server,
    tone: 'warm',
  },
]

export const experience = [
  {
    year: '2026',
    title: 'IT Intern - NQSTV, Liliw Laguna',
    description:
      "Deployed the company's live website, configured a TrueNAS NAS server with remote Tailscale VPN access, and handled IT infrastructure including networking and hardware maintenance.",
    active: true,
  },
  {
    year: '2024 - 2026',
    title: 'Thesis - Search-and-Rescue Drone System',
    description:
      'Designed a multi-function drone integrating YOLOv8 AI for real-time detection, thermal imaging, LiDAR obstacle avoidance, GPS tracking, speech broadcast, and RTH fail-safe.',
  },
  {
    year: '2022 - Present',
    title: 'Computer Engineering - PLSP',
    description:
      'Studying CpE with a focus on embedded systems, networking, and software development. Built Arduino projects, and developed hardware-software integrated systems.',
  },
]

export const webinars: Webinar[] = [
  {
    title: 'Introdction to IoT and Digital Transformation',
    description: 'offered by DICT-ITU Initiative, Completion: 27 Sept 2025',
    image: cert1,
  },
  {
    title: 'AI-Powered VA: Future-Proof Your Skills.',
    description: 'offered by DICT Region V, Given on 18th day of September 2025',
    image: cert2,
  },
  {
    title: 'Auditing Artificial Intelligenc: Risk, Opportunities, and leading Practices',
    description: 'Offered by ISACA, Given on 25th day of September 2025',
    image: cert3,
  },
  {
    title:
      'Infosession: Stardust and Stride: Gaining hadns-on experience and insights into building modern, Ai-powered Applications',
    description:
      'Prepared by Google Developer Group on Campus-Cebu Technological University, Given on 20th day of September 2025',
    image: cert4,
  },
  {
    title: 'Apply Ai: Analyze Customer Reviews',
    description: 'Offered by Networking Acaddemy, Completion: 27th day of September 2025',
    image: cert5,
  },
  {
    title: 'Building Web Solutions using Gemini and Firebase Studio',
    description:
      'Prepared by Google Developer Group on Campus-Cebu Technological University, Given on 19th day of September 2025',
    image: cert6,
  },
  {
    title: 'Internet of Things in Smart Cities',
    description: 'Prepared by DICT X, Session held on 13th day of September 2025.',
    image: cert7,
  },
  {
    title: 'Fundamentals of Programmable logic Controllers',
    description:
      'Prepared by China-ASEAN Industry-Education Integration Specialized Technical Skills Training Program, Held on 25th day of September 2025',
    image: cert8,
  },
  {
    title: 'PCB Design Course',
    description: 'Offered by Simplilearn SkillUP, Completion: 3rd Day of December 2025',
    image: cert9,
  },
  {
    title: 'learn CCNA 200-301 Network Fundamentals Online',
    description: 'offered by Simplilearn SkillUP, Completion: 16th Day of January 2025',
    image: cert10,
  },
  {
    title: 'Software Development and Design Thinking',
    description:
      'Organized by the ICT literacy and Competency Development Bureau of DICT Region X, Session Held: September 29, 2025',
    image: cert11,
  },
  {
    title: 'Serverless Architecture for enhance Public Service delivery: Use Cases for Givernment Agency',
    description:
      'Organized by DICT, CamarinesNorte Provincial Office, Region V: Given this of 30th day of September 2025',
    image: cert12,
  },
]

export const facts = [
  { image: hobby2, text: 'Fueled by coffee - always one cup too many' },
  { image: hobby1, text: 'Loves Coding and Studying Midnight' },
  { image: hobby5, text: 'Edits graphics and social media contents' },
  { image: hobby6, text: 'Loves Doing Daily Runs, For a Stronger Health' },
  { image: hobby3, text: 'Gamer - strategy and immersive worlds' },
  { image: hobby4, text: 'Music Enthusiast - from lo-fi beats to rock classics' },
]
