import type { AsyncData } from '#app';
import { buildRequestInit } from '@datocms/cda-client';
import type { TadaDocumentNode } from 'gql.tada';
import { hash } from 'ohash';
import { useQuerySubscription } from 'vue-datocms';

const isServer = typeof window === 'undefined';

type Options<Variables> = {
  variables?: Variables;
};

/**
 * `useQuery` is a composable for fetching content from DatoCMS using its
 * Content Delivery API. Depending on whether the Draft Mode is enabled or not,
 * the behavior will be different:
 *
 * When Draft Mode is OFF:
 *
 * - Thanks to `useFetch`, the GraphQL query is executed only on the server,
 *   then data is properly forwarded to the client in the payload.
 * - The contents are returned in their published version.
 *
 * When Draft Mode is ON:
 *
 * - The `X-Include-Drafts` header is set to fetch draft content.
 * - We use the result of the query to initialize the `useQuerySubscription`
 *   composable provided by vue-datocms.
 * - The useQuerySubscription connects to the DatoCMS Real-time Updates API, to
 *   be notified in real time of changes to the content, and instantly update
 *   the page with the updated content, without refreshing the browser.
 **/
export async function useQuery<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: Options<Variables>,
) {
  const config = useRuntimeConfig();
  const draftMode = useDraftMode();

  /*
   * Depending on whether the Draft Mode is active or not, we use an API token
   * with different permissions
   */
  const apiToken = draftMode
    ? // If Draft mode is ON, then we use the token saved in the cookie, which (if
      // not forged) allows us to access the contents in draft
      draftMode.datocmsDraftContentCdaToken
    : // Otherwise, we use the token to access the published content. Given that
      // this token does not expose sensitive information, it is also accessible
      // on the client side.
      config.public.datocmsPublishedContentCdaToken;

  if (!apiToken) {
    throw new Error('Missing API token');
  }
  const initialData = useFetch('https://graphql.datocms.com/', {
    ...buildRequestInit(query, {
      token: apiToken,
      includeDrafts: Boolean(draftMode),
      excludeInvalid: true,
    }),
    key: hash([query, options]),
    transform: ({ data, errors }) => {
      if (errors)
        throw new Error(
          `Something went wrong while executing the query: ${JSON.stringify(errors)}`,
        );

      return data;
    },
  }) as AsyncData<Result, null>;

  // If the Draft Mode is off, or if it is active but the composable is run
  // server-side, we simply return the result of the query.
  if (!draftMode || isServer) {
    return initialData.data;
  }

  // If we are in Draft Mode instead, and the composable is run client-side,
  // then we initiate the connection with the DatoCMS Real-time Updates API.
  return useQuerySubscription<Result, Variables>({
    query,
    variables: options?.variables,
    token: apiToken,
    initialData: (await initialData).data.value,
    includeDrafts: true,
    excludeInvalid: true,
  }).data;
}
