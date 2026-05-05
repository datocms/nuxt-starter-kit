import { ImageBlockFragment } from '~/components/blocks/ImageBlock/fragments';
import { ImageGalleryBlockFragment } from '~/components/blocks/ImageGalleryBlock/fragments';
import { VideoBlockFragment } from '~/components/blocks/VideoBlock/fragments';
import { PageInlineFragment } from '~/components/inlineRecords/PageInline/fragments';
import { PageLinkFragment } from '~/components/linkToRecords/PageLink/fragments';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { type ResultOf, graphql } from '~/lib/datocms/graphql';

/**
 * The GraphQL query that will be executed for this route to generate the page
 * content and metadata.
 *
 * The page composes one query from the fragments exported by every
 * sub-component it renders: the imports list mirrors the second argument of
 * `graphql(...)` — adding `...FooFragment` to the query string means also
 * adding `FooFragment` to the imports and to the composition array.
 *
 * Thanks to gql.tada, the result will be fully typed!
 */
export const query = graphql(
  /* GraphQL */ `
    query BasicPageQuery($slug: String!) {
      page(filter: { slug: { eq: $slug } }) {
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
            ...ImageBlockFragment
            ...ImageGalleryBlockFragment
            ...VideoBlockFragment
          }
          links {
            ... on RecordInterface {
              id
              __typename
            }
            ...PageInlineFragment
            ...PageLinkFragment
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ImageBlockFragment,
    ImageGalleryBlockFragment,
    VideoBlockFragment,
    PageInlineFragment,
    PageLinkFragment,
  ],
);

type PageResult = NonNullable<ResultOf<typeof query>['page']>;

export type StructuredTextRecord = PageResult['structuredText']['links'][0];
export type StructuredTextBlock = PageResult['structuredText']['blocks'][0];
