import carabaoImage from '../../images/gen/carabao.png'
import charcterImage from '../../images/gen/charcter.png'
import chromeImage from '../../images/gen/chrome.png'
import chrome2Image from '../../images/gen/chrome2.png'
import engrImage from '../../images/gen/engr.png'
import graduateImage from '../../images/gen/graduate.png'
import rbcrocImage from '../../images/gen/rbcroc.png'
import sharkImage from '../../images/gen/shark.png'
import standImage from '../../images/gen/stand.png'
import stand2Image from '../../images/gen/stand2.png'
import stand3Image from '../../images/gen/stand3.png'
import trexImage from '../../images/gen/trex.png'

import agentBlackKeyArt from '../../images/gen/AgentBposter.png'

import agentBlackVideo from '../../images/gen/AgentBlack.mp4'
import officerVideo from '../../images/gen/gemini_generated_video_526dc978.mp4'
import droneCatVideo from '../../images/gen/gemini_generated_video_5c35bdb7.mp4'
import chromeRunnerVideo from '../../images/gen/gemini_generated_video_c7501924.mp4'
import agentBlackPoster from '../../images/gen/poster-agentblack.jpg'
import officerPoster from '../../images/gen/poster-526dc978.jpg'
import droneCatPoster from '../../images/gen/poster-5c35bdb7.jpg'
import chromeRunnerPoster from '../../images/gen/poster-c7501924.jpg'

export type AiVideo = {
  title: string
  /** null until the render is ready — renders a placeholder card. */
  video: string | null
  /** Still frame shown before playback; null falls back to the placeholder art. */
  poster: string | null
  /** Portrait clips letterbox inside the 16:9 frame instead of cropping. */
  orientation?: 'landscape' | 'portrait'
  model: string
  duration: string
  summary: string
  prompt: string
}

/**
 * The one clip that gets top billing above the grid. Same media fields as
 * `AiVideo` plus the extras a spotlight can afford — a release note and the
 * shot-by-shot beats that fit next to a full-width player.
 */
export type AiFeaturedClip = AiVideo & {
  /** Small dateline above the title, e.g. 'August 2026'. */
  released: string
  /** The film's poster sheet, shown beside the player. Carries its own title
   *  and credits, so nothing gets overlaid on it. */
  keyArt: string
  keyArtAlt: string
  /** Tool credited under the player. */
  generator: string
  /** Short craft notes listed beside the player. */
  beats: { label: string; detail: string }[]
}

export type AiImage = {
  title: string
  /** null until the render is ready — renders a placeholder tile. */
  image: string | null
  /**
   * Every frame of a related set, cover first. Two or more turns the tile into
   * a carousel; leave it out for a one-off image.
   */
  slides?: string[]
  alt: string
  model: string
  /** Drives the tile's span in the masonry grid. */
  ratio: 'tall' | 'wide' | 'square'
  prompt: string
}

export type PromptTechnique = {
  step: string
  title: string
  tagline: string
  body: string
  /** Left/right of the before → after comparison inside each card. */
  weak: string
  strong: string
}

/** Newest piece — rendered on its own above the showcase grid. */
export const latestClip: AiFeaturedClip = {
  title: 'Agent Black',
  video: agentBlackVideo,
  poster: agentBlackPoster,
  model: 'Text-to-video',
  duration: '1:17',
  released: 'August 2026',
  keyArt: agentBlackKeyArt,
  keyArtAlt:
    'Agent Black poster: a man in a black suit and red tie looking up through the rain under an umbrella, a red sniper dot on his cheek, credited to Ken Rhendel and 8 Months Studio',
  generator: 'Gemini Flash 3.7',
  summary:
    'A noir short cut from generated shots: an operative works a rain-soaked city at night, and a sniper dot finds him mid-cigar. The point of the exercise was continuity — the same face, the same black suit and red tie, holding across every angle and location in the edit.',
  prompt:
    'Cinematic 2.3:1 short film, a stone-faced operative in a black suit and deep red tie moving through a rain-soaked neon city at night, umbrella in hand, wet asphalt reflections and traffic bokeh, a red sniper laser tracking across his face, moody teal and crimson grade, shallow depth of field, anamorphic flare, 24fps.',
  beats: [
    {
      label: 'Continuity',
      detail:
        'One locked character description reused verbatim in every shot prompt, so the suit, the tie and the face survive the cuts.',
    },
    {
      label: 'Lighting',
      detail:
        'Night rain and practicals only — street signs, headlights and one red laser doing all the key work.',
    },
    {
      label: 'Edit',
      detail:
        'Generated shots cut to a single rhythm: wide to establish, close for the beat, then out on the laser.',
    },
  ],
}

export const aiVideos: AiVideo[] = [
  {
    title: 'Arctic Portrait',
    video: officerVideo,
    poster: officerPoster,
    model: 'Text-to-video',
    duration: '0:08',
    summary:
      'A locked-off portrait against a glacier — the whole shot rests on the subject holding still while the weather moves behind him.',
    prompt:
      'Cinematic locked-off medium shot of a young officer in a black high-collar uniform standing on an arctic plain, snow-covered mountains behind him, flat overcast light, shallow depth of field, subtle wind in the hair, 24fps.',
  },
  {
    title: 'Drone Build, Interrupted',
    video: droneCatVideo,
    poster: droneCatPoster,
    model: 'Text-to-video',
    duration: '0:08',
    summary:
      'A small comedic beat — the cat is the story, so the camera stays wide enough to hold both performances in one frame.',
    prompt:
      'Handheld medium shot of a man assembling an FPV drone on a wooden table while a large ginger cat steps onto the circuit board, warm daylight from a window, natural home interior, reactive facial expression, 24fps.',
  },
  {
    title: 'Chrome Runner',
    video: chromeRunnerVideo,
    poster: chromeRunnerPoster,
    orientation: 'portrait',
    model: 'Text-to-video',
    duration: '0:08',
    summary:
      'Shot vertical for social — a liquid-metal figure running straight at the lens so the reflections keep changing as it approaches.',
    prompt:
      'Vertical tracking shot of a polished liquid-chrome humanoid runner in a blue athletic kit sprinting toward camera on a rocky path, ancient Greek temple ruins on the hill behind, golden hour backlight, mirror-like reflections, 24fps.',
  },
]

export const aiImages: AiImage[] = [
  {
    title: 'Dreadful Lybrinth',
    image: standImage,
    slides: [standImage, stand2Image, stand3Image],
    alt: 'Three-part character study of an armoured white and crimson figure: portrait, turnaround sheet and manga-style stat page',
    model: 'Text-to-image',
    ratio: 'tall',
    prompt:
      'Armoured humanoid in white lacquer plating with crimson inlay and a crown-like helm, full turnaround sheet plus a manga stat page, neutral studio backdrop, consistent lighting across every view.',
  },
  {
    title: 'Consulting Mascot Sheet',
    image: charcterImage,
    alt: 'Character sheet for a 3D consulting mascot: a badge-shaped body in a hard hat, shown from four angles with expressions and palette',
    model: 'Text-to-image',
    ratio: 'wide',
    prompt:
      'Character design sheet for a 3D mascot built from a circular company badge, orange hard hat, white gloves and red shoes, front / three-quarter / profile views, expression grid, wardrobe callouts and hex palette, clean white background.',
  },
  {
    title: 'Cost Engineering Class',
    image: engrImage,
    alt: 'Flat illustration of an engineer presenting a cost breakdown at a whiteboard to a seated class',
    model: 'Text-to-image',
    ratio: 'wide',
    prompt:
      'Flat vector illustration of an engineer in a hard hat presenting a cost breakdown on a whiteboard to a seated class, bright classroom with a city view, clean line work, corporate colour palette.',
  },
  {
    title: 'Liquid Chrome',
    image: chromeImage,
    slides: [chromeImage, chrome2Image],
    alt: 'Two editorial fashion frames of the same model in silver metallic clothing, one in a water splash and one under neon strip lights',
    model: 'Text-to-image',
    ratio: 'square',
    prompt:
      'High-fashion editorial portrait, silver metallic wardrobe, frozen water splash around the subject, cool steel palette, hard studio key light, sharp beading detail on skin and fabric.',
  },
  {
    title: 'Chrome Predators',
    image: sharkImage,
    alt: 'Chrome-armoured figure in a visor surrounded by metallic sharks and bursting water',
    model: 'Text-to-image',
    ratio: 'square',
    prompt:
      'Chrome-armoured figure wearing a mirrored visor, surrounded by polished metal sharks and exploding water, overcast sci-fi skyline behind, monochrome silver palette, high contrast.',
  },
  {
    title: 'Rice Field, Golden Hour',
    image: carabaoImage,
    alt: 'Farmer working a flooded rice paddy behind a carabao, mountains in the distance',
    model: 'Text-to-image',
    ratio: 'wide',
    prompt:
      'Documentary photograph of a Filipino farmer ploughing a flooded rice paddy behind a carabao, palm trees and mountains on the horizon, midday light, natural colour, 35mm.',
  },
  {
    title: 'Graduation Dunk',
    image: graduateImage,
    alt: 'Comic-style illustration of a graduate in cap and gown dunking a basketball past Spider-Man',
    model: 'Text-to-image',
    ratio: 'tall',
    prompt:
      'Comic book illustration of a graduate in cap and gown dunking a basketball over a costumed hero, packed arena, confetti and stadium lights, bold ink lines, dynamic low angle.',
  },
  {
    title: 'Citrus Contender',
    image: rbcrocImage,
    alt: 'Crocodile with a lemon for a body, wearing a racing cap and holding a team flag in a marsh',
    model: 'Text-to-image',
    ratio: 'square',
    prompt:
      'Photoreal crocodile whose body is a whole lemon sitting in shallow marsh water, wearing a racing team cap and holding a small team flag, dry reeds behind, soft overcast light, macro detail on the peel.',
  },
  {
    title: 'Prehistoric Patient',
    image: trexImage,
    alt: 'Chiropractor adjusting a life-sized T-rex lying on a treatment table in a clinic',
    model: 'Text-to-image',
    ratio: 'tall',
    prompt:
      'Photoreal shot of a chiropractor adjusting a life-sized tyrannosaurus lying on a treatment table in an ordinary clinic room, fluorescent light, anatomy poster on the wall, played completely straight.',
  },
]

export const promptTechniques: PromptTechnique[] = [
  {
    step: '01',
    title: 'Straightforward & detailed',
    tagline: 'Say exactly what you want to see',
    body:
      'Vague prompts hand the decisions back to the model. I name the subject, the lighting, the lens, the mood, and the framing up front — so the first generation is already close instead of a lucky guess.',
    weak: 'A nice photo of a car.',
    strong:
      'A matte black sports car parked on wet asphalt at dusk, three-quarter front view, 35mm lens, rim light from a streetlamp behind it, cool blue tones, light rain.',
  },
  {
    step: '02',
    title: 'Prompt-enhancing',
    tagline: 'Let one AI sharpen the prompt for another',
    body:
      'Before generating, I hand my rough idea to a language model and ask it to expand and tighten it — adding the details I would otherwise forget. The refined prompt is what actually goes into the image or video model.',
    weak: 'Straight to the generator with a one-line idea.',
    strong:
      'Refine this prompt for an image model. Keep my intent, add lighting, lens, composition and mood details, and remove anything ambiguous — then give me the final prompt only.',
  },
  {
    step: '03',
    title: 'Role-play framing',
    tagline: 'Give the model a job before you give it a task',
    body:
      'Assigning a role changes the vocabulary and the priorities the model works from. A graphic designer talks about hierarchy and spacing; a cinematographer talks about lenses and light. The role shapes the output before the brief even starts.',
    weak: 'Make this look good.',
    strong:
      'You are a senior graphic designer. Critique this layout for hierarchy, spacing and contrast, then describe the improved version as a prompt I can generate.',
  },
]
