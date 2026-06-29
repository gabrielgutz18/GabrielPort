

import gvgImage from '../../images/gvg.png'
import nqstvImage from '../../images/nqstv.png'

export type Project = {
  name: string
  description: string
  image?: string
  link?: string
}

export const projects: Project[] = [
  {
    name: 'NQSTV Website',
    description: 'Live company website',
    image: nqstvImage,
    link: 'https://nqstv.net',
  },

  {
    name: 'GvG Variety Store',
    image: gvgImage,
    description: 'Unfinished',
  },
  {
    name: 'Computer History',
    description: 'School Project',
  },
]
