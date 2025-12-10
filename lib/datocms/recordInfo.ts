/*
 * Type-safe record handling using DatoCMS's generated types.
 *
 * This file uses types generated from your DatoCMS schema via `npm run generate-cma-types`.
 * The generated types provide full autocomplete and compile-time safety when
 * accessing record fields.
 *xp
 * See: https://www.datocms.com/docs/content-management-api/resources/item#type-safe-development-with-typescript
 */
import type { RawApiTypes } from '@datocms/cma-client';
import type { AnyModel } from './cma-types';

/*
 * Both the "Web Previews" and "SEO/Readability Analysis" plugins from DatoCMS
 * need to know the URL of the site that corresponds to each DatoCMS record to
 * work properly. These two functions are responsible for returning this
 * information, and are utilized by the API routes associated with the two
 * plugins:
 *
 * - server/api/seo-analysis/index.ts
 * - server/api/preview-links/index.ts
 */

/**
 * Gets the item type ID from a DatoCMS item.
 *
 * When items are fetched via the CMA client, `__itemTypeId` is added to the object.
 * When items come from webhooks (like the Web Previews plugin), the item type ID
 * is in `relationships.item_type.data.id` instead.
 */
function getItemTypeId(item: RawApiTypes.Item<AnyModel>) {
  // CMA client adds __itemTypeId when fetching items
  if (item.__itemTypeId) {
    return item.__itemTypeId;
  }

  // Webhook payloads have the item type ID in relationships
  const relationshipId = item.relationships?.item_type?.data?.id;
  if (typeof relationshipId === 'string') {
    return relationshipId;
  }

  return undefined;
}

export async function recordToWebsiteRoute(
  item: RawApiTypes.Item<AnyModel>,
  _locale: string,
) {
  const itemTypeId = getItemTypeId(item);

  switch (itemTypeId) {
    // Page model
    case 'JdG722SGTSG_jEB1Jx-0XA': {
      return '/';
    }
    default:
      return null;
  }
}

export async function recordToSlug(
  item: RawApiTypes.Item<AnyModel>,
  _locale: string,
) {
  const itemTypeId = getItemTypeId(item);

  switch (itemTypeId) {
    // Page model
    case 'JdG722SGTSG_jEB1Jx-0XA': {
      /*
       * Using generated types, TypeScript knows exactly which fields exist.
       * `item.attributes.title` is fully typed - no casts needed!
       */
      return item.attributes.title;
    }
    default:
      return null;
  }
}
