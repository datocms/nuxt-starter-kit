import { graphql } from '~/lib/datocms/graphql';

/**
 * Let's define the GraphQL fragment needed for the component to function.
 *
 * GraphQL fragment colocation keeps queries near the components using them,
 * improving maintainability and encapsulation. Fragment composition enables
 * building complex queries from reusable parts, promoting code reuse and
 * efficiency. Together, these practices lead to more modular, maintainable, and
 * performant GraphQL implementations by allowing precise data fetching and
 * easier code management.
 *
 * Learn more: https://gql-tada.0no.co/guides/fragment-colocation
 */
export const VideoPlayerFragment = graphql(/* GraphQL */ `
  fragment VideoPlayerFragment on VideoFileField {
    video {
      # required: this field identifies the video to be played
      muxPlaybackId

      # all the other fields are not required but:

      # if provided, title is displayed in the upper left corner of the video
      title

      # if provided, width and height are used to define the aspect ratio of the
      # player, so to avoid layout jumps during the rendering.
      width
      height

      # if provided, it shows a blurred placeholder for the video
      blurUpThumb
    }
  }
`);
