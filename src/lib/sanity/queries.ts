import { defineQuery } from "groq";

export const POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    publishedAt <= now()
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    excerpt,
    publishedAt,
    _updatedAt,

    coverImage {
      _type,
      alt,
      caption,
      "url": asset->url,
      "assetId": asset->_id,
      "dimensions": asset->metadata.dimensions {
        width,
        height,
        aspectRatio
      },
      crop {
        top,
        bottom,
        left,
        right
      },
      hotspot {
        x,
        y,
        height,
        width
      }
    },

    author->{
      name,
      "slug": slug.current
    },

    categories[]->{
      title,
      "slug": slug.current
    }
  }
`);

export const POST_QUERY = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug &&
    publishedAt <= now()
  ][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    seoTitle,
    description,
    excerpt,
    publishedAt,
    "modifiedAt": coalesce(_updatedAt, publishedAt),

    coverImage {
      _type,
      alt,
      caption,
      "url": asset->url,
      "assetId": asset->_id,
      "dimensions": asset->metadata.dimensions {
        width,
        height,
        aspectRatio
      },
      crop {
        top,
        bottom,
        left,
        right
      },
      hotspot {
        x,
        y,
        height,
        width
      }
    },

    author->{
      name,
      "slug": slug.current,
      bio
    },

    categories[]->{
      title,
      "slug": slug.current
    },

    body[] {
      _type == "block" => {
        _key,
        _type,
        style,
        listItem,
        level,
        children[] {
          _key,
          _type,
          text,
          marks
        },
        markDefs[] {
          _key,
          _type,
          href,
          openInNewTab
        }
      },

      _type == "image" => {
        _key,
        _type,
        alt,
        caption,
        "url": asset->url,
        "assetId": asset->_id,
        "dimensions": asset->metadata.dimensions {
          width,
          height,
          aspectRatio
        },
        crop {
          top,
          bottom,
          left,
          right
        },
        hotspot {
          x,
          y,
          height,
          width
        }
      }
    }
  }
`);
