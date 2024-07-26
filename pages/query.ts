import { ImageBlockFragment } from '~/components/blocks/ImageBlock/fragments';
import { ImageGalleryBlockFragment } from '~/components/blocks/ImageGalleryBlock/fragments';
import { VideoBlockFragment } from '~/components/blocks/VideoBlock/fragments';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { type ResultOf, graphql } from '~/lib/datocms/graphql';

/**
 * The GraphQL query that will be executed for this route to generate the page
 * content and metadata.
 *
 * Thanks to gql.tada, the result will be fully typed!
 */
export const query = graphql(
  /* GraphQL */ `
    query BasicPageQuery {
      page {
        _seoMetaTags {
          ...TagFragment
        }
        title
        _firstPublishedAt
        structuredText {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ... on ImageBlockRecord {
              ...ImageBlockFragment
            }
            ... on ImageGalleryBlockRecord {
              ...ImageGalleryBlockFragment
            }
            ... on VideoBlockRecord {
              ...VideoBlockFragment
            }
          }
          links {
            ... on RecordInterface {
              id
              __typename
            }
            ... on PageRecord {
              title
            }
          }
        }
      }
    }
  `,
  [TagFragment, ImageBlockFragment, ImageGalleryBlockFragment, VideoBlockFragment],
);

type PageResult = NonNullable<ResultOf<typeof query>['page']>;

export type StructuredTextRecord = PageResult['structuredText']['links'][0];
export type StructuredTextBlock = PageResult['structuredText']['blocks'][0];
