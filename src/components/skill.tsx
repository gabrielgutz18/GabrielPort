import './css/skill.css'
import './css/reveal.css'
import type { ReactNode } from 'react'
import LogoLoop from './LogoLoop'
import { useReveal } from '../hooks/useReveal'
import {
  SiArduino,
  SiCanva,
  SiCplusplus,
  SiCss,
  SiGithub,
  SiGodaddy,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiOpenai,
  SiPython,
  SiRaspberrypi,
  SiVercel,
  SiSupabase,
  SiTypescript,
  SiReact,
  SiAnthropic,
 
} from 'react-icons/si' 
import { VscVscode } from 'react-icons/vsc'
import { BiPointer } from 'react-icons/bi'
import { BrainCircuit, Code2, Cpu, Layers3, MessageCircle, Sparkles, UsersRound } from 'lucide-react'
import { GridPattern } from "@/components/ui/grid-pattern"
type SkillItem = string | {
  label: string
  icon: ReactNode
}

const techLogos = [
  { node: <SiPython />, title: 'Python', href: 'https://www.python.org' },
  { node: <SiCanva />, title: 'Canva', href: 'https://www.canva.com' },
  { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { node: <SiCss />, title: 'CSS', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { node: <SiGithub />, title: 'GitHub', href: 'https://github.com' },
  { node: <SiVercel />, title: 'Vercel', href: 'https://vercel.com' },
  { node: <SiGodaddy />, title: 'GoDaddy', href: 'https://www.godaddy.com' },
  { node: <SiGooglegemini />, title: 'Gemini', href: 'https://gemini.google.com' },
  { node: <SiOpenai />, title: 'Codex', href: 'https://openai.com/codex' },
  { node: <VscVscode />, title: 'VS Code', href: 'https://code.visualstudio.com' },
  { node: <SiSupabase />, title: 'Supabase', href: 'https://supabase.com' },
  { node: <BiPointer />, title: 'Cursor', href: 'https://www.cursor.com' },
  { node: <SiArduino />, title: 'Arduino IDE', href: 'https://www.arduino.cc/en/software' },
  { node: <SiRaspberrypi />, title: 'Raspberry Pi', href: 'https://www.raspberrypi.com' },
  { node: <SiMysql />, title: 'MySQL', href: 'https://www.mysql.com' },
  { node: <SiCplusplus />, title: 'C++', href: 'https://isocpp.org' },
  { node: <SiReact />, title: 'ReactJS', href: 'https://react.dev' },
  { node: <SiTypescript />, title: 'Typescript', href: 'https://www.typescriptlang.org' },
  { node: <SiAnthropic />, title: 'Claude code', href: 'https://anthropic.com' },
  
]

const skillGroups = [
  {
    title: 'Development',
    summary: 'Building responsive interfaces, scripting workflows, and wiring front-end logic into practical systems.',
    Icon: Code2,
    skills: [
      { label: 'Python', icon: <SiPython aria-hidden="true" /> },
      { label: 'JavaScript', icon: <SiJavascript aria-hidden="true" /> },
      { label: 'HTML5', icon: <SiHtml5 aria-hidden="true" /> },
      { label: 'CSS', icon: <SiCss aria-hidden="true" /> },
      { label: 'C++', icon: <SiCplusplus aria-hidden="true" /> },
      { label: 'MySQL', icon: <SiMysql aria-hidden="true" /> },
      { label: 'ReactJS', icon: <SiReact aria-hidden="true" /> },
      { label: 'Typescript', icon: <SiTypescript aria-hidden="true" /> },
    ],
  },
  {
    title: 'Platforms',
    summary: 'Shipping projects with version control, hosting, database tools, and domain setup.',
    Icon: Layers3,
    skills: [

      { label: 'GitHub', icon: <SiGithub aria-hidden="true" /> }, 
      { label: 'Vercel', icon: <SiVercel aria-hidden="true" /> },
      { label: 'Supabase', icon: <SiSupabase aria-hidden="true" /> },
      { label: 'GoDaddy', icon: <SiGodaddy aria-hidden="true" /> }
    
    ],
  },
  {
    title: 'AI & Creative Tools',
    summary: 'Using AI-assisted development and design tools to move faster while keeping the work intentional.',
    Icon: BrainCircuit,
    skills: [
      { label: 'OpenAI Codex', icon: <SiOpenai aria-hidden="true" /> },
      { label: 'Gemini', icon: <SiGooglegemini aria-hidden="true" /> },
      { label: 'Claude code', icon: <SiAnthropic aria-hidden="true" /> },
      { label: 'Cursor', icon: <BiPointer aria-hidden="true" /> },
      { label: 'VS Code', icon: <VscVscode aria-hidden="true" /> },
      { label: 'Canva', icon: <SiCanva aria-hidden="true" /> }
    ],
  },
  {
    title: 'Technical/ Hardware',
    summary: 'Experience with microcontrollers, single-board computers, and general computer engineering tasks to build and maintain practical systems.',
    Icon: Cpu,
    skills: [
      { label: 'Arduino IDE', icon: <SiArduino aria-hidden="true" /> },
      { label: 'Raspberry Pi', icon: <SiRaspberrypi aria-hidden="true" /> },
      'Pixhawk autopilot',
      'Computer System',
      'troubleshooting and Maintenance',
      'Networking',
      'Network Attached Storage (NAS) setup and management',
      'installing operating Systems and software',
      'Hardware Installation and Upgrades',   
      'IT support',
    ],
  },
  
]

const softSkills = [
  'Problem-solving',
  'Critical thinking',
  'Communication',
  'Teamwork',
  'Adaptability',
  'Time management',
  'Creativity',
]

const focusAreas = [
  { value: 'Web', label: 'Clean, responsive portfolio and business pages' },
  { value: 'Systems', label: 'NAS, networking, IoT, and embedded workflows' },
  { value: 'AI', label: 'AI-assisted coding, research, and content creation' },
]

function Skill() {
  const { ref, revealClass } = useReveal<HTMLElement>()

  const renderSkill = (skill: SkillItem) => {
    if (typeof skill === 'string') {
      return skill
    }

    return (
      <>
        <span className="skill-chip-icon">{skill.icon}</span>
        {skill.label}
      </>
    )
  }

  const getSkillKey = (skill: SkillItem) =>
    typeof skill === 'string' ? skill : skill.label

  return (
    <section
      ref={ref}
      className={`skill ${revealClass}`}
      id="skills"
      aria-labelledby="skills-heading"
    >
      <GridPattern
        strokeDasharray="4 2"
        className="-z-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
      />
      <div className="skill-logo-loop">
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#f5f7fb"
          ariaLabel="Technology skills"
        />
      </div>

      <div className="skill-header reveal-item">
        <p className="skill-label">Technical toolkit</p>
        <div className="skill-heading-row">
          <h1 className="skill-title" id="skills-heading">
            Skills that turn ideas into working systems<span>.</span>
          </h1>
          <p className="skill-intro">
            A mix of web development, deployment, AI-assisted workflows, and
            computer engineering tools shaped by hands-on projects.
          </p>
        </div>
      </div>

      <div className="skill-layout">
        <div className="skill-grid" role="list" aria-label="Technical skill groups">
          {skillGroups.map(({ title, summary, Icon, skills }, index) => (
            <article
              className={`skill-card reveal-item reveal-delay-${Math.min(index + 1, 6)}`}
              role="listitem"
              key={title}
            >
              <div className="skill-card-top">
                <span className="skill-card-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h2>{title}</h2>
              </div>
              <p>{summary}</p>
              <ul className="skill-chip-list" aria-label={`${title} skills`}>
                {skills.map((skill) => (
                  <li key={getSkillKey(skill)}>{renderSkill(skill)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <aside
          className="soft-skill-card reveal-item reveal-delay-2"
          aria-labelledby="soft-skills-heading"
        >
          <div className="soft-card-header">
            <span className="soft-card-icon">
              <Sparkles aria-hidden="true" />
            </span>
            <div>
              <p className="soft-card-kicker">How I work</p>
              <h2 id="soft-skills-heading">Soft skills</h2>
            </div>
          </div>

          <ul className="soft-skill-list">
            {softSkills.map((skill) => (
              <li key={skill}>
                <span aria-hidden="true"></span>
                {skill}
              </li>
            ))}
          </ul>

          <div className="skill-collab-note">
            <UsersRound aria-hidden="true" />
            <p>
              Comfortable learning fast, communicating clearly, and improving
              projects through feedback.
            </p>
          </div>
        </aside>
      </div>

      <div className="skill-focus-grid" role="list" aria-label="Current focus areas">
        {focusAreas.map((area, index) => (
          <div
            className={`skill-focus-card reveal-item reveal-delay-${index + 1}`}
            role="listitem"
            key={area.value}
          >
            <strong>{area.value}</strong>
            <span>{area.label}</span>
          </div>
        ))}
        <div
          className="skill-focus-card skill-focus-card-dark reveal-item reveal-delay-4"
          role="listitem"
        >
          <MessageCircle aria-hidden="true" />
          <span>Ready to collaborate on practical, user-friendly builds.</span>
        </div>
      </div>
    </section>
  )
}

export default Skill
