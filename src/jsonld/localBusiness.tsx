import React, { FC } from 'react';
import Head from 'next/head';

import markup from '../utils/markup';
import formatIfArray from '../utils/formatIfArray';

type Address = {
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode: string;
  addressCountry: string;
};

type Geo = {
  latitude: string;
  longitude: string;
};

type ReviewRating = {
  bestRating?: string;
  ratingValue: string;
  worstRating?: string;
};

type Review = {
  author: string;
  datePublished?: string;
  reviewBody?: string;
  name?: string;
  reviewRating: ReviewRating;
};

const buildReviewRating = (rating: ReviewRating) =>
  rating
    ? `"reviewRating": {
          "@type": "Rating",
          ${rating.bestRating ? `"bestRating": "${rating.bestRating}",` : ''}
          ${rating.worstRating ? `"worstRating": "${rating.worstRating}",` : ''}
          "ratingValue": "${rating.ratingValue}"
        },`
    : '';

const buildReviews = (reviews: Review[]) => `
"review": [
  ${reviews.map(
    review => `{
      "@type": "Review",
      ${
        review.datePublished
          ? `"datePublished": "${review.datePublished}",`
          : ''
      }
      ${review.reviewBody ? `"reviewBody": "${review.reviewBody}",` : ''}
      ${review.name ? `"name": "${review.name}",` : ''}
      ${buildReviewRating(review.reviewRating)}
      "author": "${review.author}"
  }`,
  )}],`;

export interface LocalBusinessJsonLdProps {
  type: string;
  id: string;
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address: Address;
  geo: Geo;
  images: string[];
  reviews?: Review[];
}

const buildGeo = (geo: Geo) => `
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "${geo.latitude}",
    "longitude": "${geo.longitude}"
  },
`;

const buildAddress = (address: Address) => `
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "${address.streetAddress}",
    "addressLocality": "${address.addressLocality}",
    ${
      address.addressRegion
        ? `"addressRegion": "${address.addressRegion}",`
        : ''
    }
    "postalCode": "${address.postalCode}",
    "addressCountry": "${address.addressCountry}"
  },
`;

const LocalBusinessJsonLd: FC<LocalBusinessJsonLdProps> = ({
  type,
  id,
  name,
  description,
  url,
  telephone,
  address,
  geo,
  images,
  reviews
}) => {
  const jslonld = `{
    "@context": "http://schema.org",
    "@type": "${type}",
    "@id": "${id}",
    ${description ? `"description": "${description}",` : ''}
    ${url ? `"url": "${url}",` : ''}
    ${telephone ? `"telephone": "${telephone}",` : ''}
    ${buildAddress(address)}
    ${geo ? `${buildGeo(geo)}` : ''}
    "image":${formatIfArray(images)},
    "name": "${name}"
    ${reviews.length ? buildReviews(reviews) : ''}
  }`;

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={markup(jslonld)}
        key="jsonld-local-business"
      />
    </Head>
  );
};

export default LocalBusinessJsonLd;
