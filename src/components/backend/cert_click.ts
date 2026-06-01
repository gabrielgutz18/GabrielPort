export type CertificateZoom = {
  src: string
  alt: string
  title: string
}

export const createCertificateZoom = (
  src: string,
  title: string,
): CertificateZoom => ({
  src,
  alt: `${title} certificate`,
  title,
})
