import sanityClient from '@sanity/client';
import imageUrluilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-11-16',
  useCdn: true,
  token: process.env.REACT_APP_SANITY_PROJECT_TOKEN,
});

const builder = imageUrluilder(client);

export const urlFor = (source) => builder.image(source);