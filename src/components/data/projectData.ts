

import gvgImage from '../../images/gvg.png'

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
    image:
      'https://scontent.fcgy1-1.fna.fbcdn.net/v/t39.30808-6/702214433_1587577416708296_7799185318262289996_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHMeLbpuCkQbS9tmSUUutpjzEKwpxQNzInMQrCnFA3MiaI_TQA4Gvg8wVkwF6NmsOkaMxNtf7MVjFVormvDGHOp&_nc_ohc=DRqP0rvbxMUQ7kNvwGUVs66&_nc_oc=Adp0b2rkqQWgmJeXl7zAMHyRHjTZ7inJqVtgO60ndUvWpCWMocbaDemU3K7DxcaadHCwiPhWszx--urID_ipGMMJ&_nc_zt=23&_nc_ht=scontent.fcgy1-1.fna&_nc_gid=aPifmGJszG3T-eC5XqFDog&_nc_ss=7b2a8&oh=00_Af_TYq_svOmPBiZCR59gEhdU6_-3WgFjfWyI70JEvq4TiQ&oe=6A236878',
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
