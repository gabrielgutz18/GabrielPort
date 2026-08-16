/**
 * Content for the AI Creation showcase page.
 *
 * The real renders aren't produced yet, so every `video` / `image` field is
 * `null` on purpose — the page renders a styled placeholder for those instead
 * of a broken <video>/<img>. To publish a piece, drop the file in
 * src/images (or src/assets), import it here, and swap the null for the import.
 */

export type AiVideo = {
  title: string
  /** null until the render is ready — renders a placeholder card. */
  video: string | null
  /** Still frame shown before playback; null falls back to the placeholder art. */
  poster: string | null
  model: string
  duration: string
  summary: string
  prompt: string
}

export type AiImage = {
  title: string
  /** null until the render is ready — renders a placeholder tile. */
  image: string | null
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

export const aiVideos: AiVideo[] = [
  {
    title: 'Neon City Flythrough',
    video: null,
    poster: null,
    model: 'Text-to-video',
    duration: '0:12',
    summary:
      'A slow camera push down a rain-soaked street, shot to feel like a handheld night take rather than a rendered scene.',
    prompt:
      'Cinematic drone shot flying low through a rain-soaked neon street at night, reflections on wet asphalt, shallow depth of field, 24fps motion blur, teal and magenta lighting.',
  },
  {
    title: 'Product Reveal Loop',
    video: null,
    poster: null,
    model: 'Image-to-video',
    duration: '0:08',
    summary:
      'A seamless loop built from a single still, animated with a controlled orbit so the product stays the focus.',
    prompt:
      'Slow 30-degree orbit around a matte black device on a seamless studio backdrop, soft key light from the upper left, subtle rim light, no camera shake, loops seamlessly.',
  },
  {
    title: 'Abstract Motion Study',
    video: null,
    poster: null,
    model: 'Text-to-video',
    duration: '0:15',
    summary:
      'A texture piece for backgrounds — liquid light moving slowly enough to sit behind type without fighting it.',
    prompt:
      'Macro shot of iridescent liquid ink blooming in clear water, ultra slow motion, dark background, volumetric light from behind, high contrast, minimal color palette.',
  },
]

export const aiImages: AiImage[] = [
  {
    title: 'Character Creation',
    image: null,
    alt: 'AI-generated character portrait study with different angles and expressions',
    model: 'Text-to-image',
    ratio: 'tall',
    prompt:
      'Editorial portrait, 85mm lens, soft window light from camera left, muted earth-tone wardrobe, film grain, shallow depth of field.',
  },
  {
    title: 'Architecture Concept',
    image: null,
    alt: 'AI-generated architecture concept render',
    model: 'Text-to-image',
    ratio: 'wide',
    prompt:
      'Brutalist concrete pavilion at golden hour, long shadows, wide-angle architectural photography, clear sky, human figure for scale.',
  },
  {
    title: 'Product Mockup',
    image: null,
    alt: 'AI-generated product mockup',
    model: 'Text-to-image',
    ratio: 'square',
    prompt:
      'Minimal product photography of a ceramic bottle on a stone plinth, single softbox, deep shadows, negative space on the right for copy.',
  },
  {
    title: 'Landscape Frame',
    image: null,
    alt: 'AI-generated landscape frame',
    model: 'Text-to-image',
    ratio: 'wide',
    prompt:
      'Aerial view of a volcanic coastline at dawn, low mist over black sand, muted blue-grey palette, natural light, no people.',
  },
  {
    title: 'Character Design',
    image: null,
    alt: 'AI-generated character design sheet',
    model: 'Text-to-image',
    ratio: 'tall',
    prompt:
      'Character design sheet, front and side view, stylised realism, neutral grey background, consistent lighting, clean line work.',
  },
  {
    title: 'Poster Composition',
    image: null,
    alt: 'AI-generated poster composition',
    model: 'Text-to-image',
    ratio: 'square',
    prompt:
      'Swiss-style poster layout, bold geometric shapes, two-colour palette, generous margins, flat print texture.',
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
