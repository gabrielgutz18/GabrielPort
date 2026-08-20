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

/* Soft skills are the last group rather than a separate dark panel: they are
   part of the same toolkit, and keeping them in the list means one column
   rhythm down the whole section instead of a sidebar competing with it. */
const skillGroups = [
  {
    title: 'Development',
    summary: 'Building responsive interfaces, scripting workflows, and wiring front-end logic into practical systems.',
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
    skills: [
      { label: 'GitHub', icon: <SiGithub aria-hidden="true" /> },
      { label: 'Vercel', icon: <SiVercel aria-hidden="true" /> },
      { label: 'Supabase', icon: <SiSupabase aria-hidden="true" /> },
      { label: 'GoDaddy', icon: <SiGodaddy aria-hidden="true" /> },
    ],
  },
  {
    title: 'AI & Creative Tools',
    summary: 'Using AI-assisted development and design tools to move faster while keeping the work intentional.',
    skills: [
      { label: 'OpenAI Codex', icon: <SiOpenai aria-hidden="true" /> },
      { label: 'Gemini', icon: <SiGooglegemini aria-hidden="true" /> },
      { label: 'Claude code', icon: <SiAnthropic aria-hidden="true" /> },
      { label: 'Cursor', icon: <BiPointer aria-hidden="true" /> },
      { label: 'VS Code', icon: <VscVscode aria-hidden="true" /> },
      { label: 'Canva', icon: <SiCanva aria-hidden="true" /> },
    ],
  },
  {
    title: 'Technical & Hardware',
    summary: 'Microcontrollers, single-board computers, and the general computer engineering work that keeps practical systems running.',
    skills: [
      { label: 'Arduino IDE', icon: <SiArduino aria-hidden="true" /> },
      { label: 'Raspberry Pi', icon: <SiRaspberrypi aria-hidden="true" /> },
      'Pixhawk autopilot',
      'Computer troubleshooting',
      'Networking',
      'NAS setup and management',
      'OS and software installs',
      'Hardware upgrades',
      'IT support',
    ],
  },
  {
    title: 'How I work',
    summary: 'Comfortable learning fast, communicating clearly, and improving projects through feedback.',
    skills: [
      'Problem-solving',
      'Critical thinking',
      'Communication',
      'Teamwork',
      'Adaptability',
      'Time management',
      'Creativity',
    ],
  },
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
      <div className="skill-header">
        <p className="skill-label reveal-item">Technical toolkit</p>
        <h1 className="skill-title reveal-item" id="skills-heading">
          Skills that turn ideas into working systems<span>.</span>
        </h1>
        <p className="skill-intro reveal-item reveal-delay-1">
          A mix of web development, deployment, AI-assisted workflows, and
          computer engineering tools shaped by hands-on projects.
        </p>
      </div>

      <div className="skill-logo-loop reveal-item reveal-delay-2">
        <LogoLoop
          logos={techLogos}
          speed={70}
          direction="left"
          logoHeight={44}
          gap={56}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#f5f7fb"
          ariaLabel="Technology skills"
        />
      </div>

      <div className="skill-rows">
        {skillGroups.map(({ title, summary, skills }, index) => (
          <article
            className={`skill-row reveal-item reveal-delay-${Math.min(index + 1, 6)}`}
            key={title}
          >
            <div className="skill-row-head">
              <p className="skill-row-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h2>{title}</h2>
              <p className="skill-row-summary">{summary}</p>
            </div>
            <ul className="skill-chip-list" aria-label={`${title} skills`}>
              {skills.map((skill) => (
                <li key={getSkillKey(skill)}>{renderSkill(skill)}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="skill-focus reveal-item">
        <p className="skill-focus-label">Currently focused on</p>
        <ul className="skill-focus-list">
          {focusAreas.map((area) => (
            <li key={area.value}>
              <strong>{area.value}</strong>
              <span>{area.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="skill-closing reveal-item reveal-delay-1">
        <p>
          <strong>Open to collaborate</strong> on practical, user-friendly builds.
        </p>
      </div>
    </section>
  )
}

export default Skill
