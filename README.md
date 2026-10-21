<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# Nuxt Starter Kit

This project aims to be a great starting point for your Nuxt projects that need to interact with DatoCMS.

- 🔍 **Fully commented code** — Every file is commented and explained in detail, it will be impossible to get lost!
- 💯 **100% TypeScript** — Thanks to [gql.tada](https://gql-tada.0no.co/) every GraphQL query is fully typed, and your IDE will help you complete the GraphQL queries.
- 🛠️ **Minimal boilerplate** — The project is minimal and exposes only what is necessary to get started, without complicated models that need to be removed.
- 🚫 **Zero CSS** — There is only one CSS import, which you can remove to use your preferred CSS tool.
- 📝 **Full support for Draft Mode** — Your editors can always view the latest draft version of the content.
- ✏️ **Click-to-edit overlays** — Integrated [@datocms/content-link](https://www.npmjs.com/package/@datocms/content-link) for intuitive content editing. Click on any content element on your website to instantly open the DatoCMS editor for that specific field.
- 🧩 **Plugin ready** — Full integration with the [Web Previews](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) plugin, including Visual Editing mode for seamless in-context editing, and [SEO/Readability Analysis](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis).
- 🔄 **DatoCMS's Real-time Updates API** — Your editors can see updated content instantly as soon as you save a new version on DatoCMS.
- 🌐 **SEO Metadata** — Full integration between Nuxt and the SEO settings coming from DatoCMS.
- 📦 **Official CDA Client** — Uses [@datocms/cda-client](https://github.com/datocms/cda-client) for performant, type-safe GraphQL queries to the Content Delivery API.
- 🔒 **Type-Safe CMA Client** — Uses [@datocms/cma-client](https://www.datocms.com/docs/content-management-api/resources/item#type-safe-development-with-typescript) with auto-generated types from your schema for full autocomplete and compile-time safety.

## How to use

### Quick start

1. [Create an account on DatoCMS](https://datocms.com).

2. Make sure that you have set up the [Github integration on Vercel](https://vercel.com/docs/git/vercel-for-github).

3. Let DatoCMS set everything up for you clicking this button below:

[![Deploy with DatoCMS](https://dashboard.datocms.com/deploy/button.svg)](https://dashboard.datocms.com/deploy?repo=datocms%2Fnuxt-starter-kit%3Amain)

### Local setup

Once the setup of the project and repo is done, clone the repo locally.

#### Set up environment variables

Copy the sample .env file:

```bash
cp .env.local.example .env.local
```

In your DatoCMS' project, go to the **Settings** menu at the top and click **API tokens**.

Copy the values of the following tokens into the specified environment variable:

- `NUXT_PUBLIC_DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN`: CDA Only (Published)
- `NUXT_DATOCMS_DRAFT_CONTENT_CDA_TOKEN`: CDA Only (Draft)
- `NUXT_DATOCMS_CMA_TOKEN`: CMA Only (Read)

Then set the following additional variable:

- `NUXT_PUBLIC_DATOCMS_BASE_EDITING_URL`: Your DatoCMS project URL (e.g., `https://your-project.admin.datocms.com`). This enables click-to-edit overlays that link content directly to the DatoCMS editor.

Then set both `NUXT_SECRET_API_TOKEN` and `NUXT_SIGNED_COOKIE_JWT_SECRET` by generating two different secure strings (you can use `openssl rand -hex 32` or any other cryptographically-secure random string generator):

- The `NUXT_SECRET_API_TOKEN` will be used to safeguard all API routes from incoming requests from untrusted sources;
- The `NUXT_SIGNED_COOKIE_JWT_SECRET` will be used to sign the Draft Mode cookies.

There's also an optional `NUXT_PUBLIC_DRAFT_MODE_DEMO_PASSWORD`: when set, its value pre-fills the Draft Mode prompt for every visitor. We only use it on our public demo, so that anyone can try Draft Mode. Leave it unset on your own project.

#### Run your project locally

```bash
npm install
npm run dev
```

Your website should be up and running on [http://localhost:3000](http://localhost:3000)!

## Click-to-edit overlays

This starter kit includes [@datocms/content-link](https://www.npmjs.com/package/@datocms/content-link), which provides intuitive click-to-edit overlays for your content.

### How to use

When viewing your website in draft mode, **press and hold the Alt/Option key** to enable click-to-edit mode. Interactive overlays will appear on all editable content. Release the key to disable the overlays.

This feature works in two powerful ways:

### 1. Standalone website editing

Click on any content element to instantly open the DatoCMS editor for that specific field in a new tab. This makes it incredibly easy for editors to jump directly to the content they want to modify.

### 2. Web Previews plugin Visual Editing mode

When using the [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) in Visual Editing mode, clicking on content opens the field editor in a side panel right next to your preview. The integration also enables:

- **In-plugin navigation**: Users can navigate to different URLs within the Visual mode interface (like a browser navigation bar), and the preview automatically updates to show the corresponding page
- **Synchronized state**: The preview and DatoCMS interface stay in perfect sync

This bidirectional communication is established automatically when your preview runs inside the Web Previews plugin—no additional configuration needed **on the code side**. The Web Previews plugin itself, however, still needs to exist and point at your app. If you deployed through the marketplace that happens automatically; otherwise, see [Configuring Visual Editing manually](#configuring-visual-editing-manually) below.

### Configuring Visual Editing manually

When you deploy this starter through the [DatoCMS marketplace](https://dashboard.datocms.com/deploy?repo=datocms%2Fnuxt-starter-kit%3Amain), the
Web Previews plugin (which powers Visual Editing) is installed and configured for
you automatically by the [`server/api/post-deploy/index.ts`](server/api/post-deploy/index.ts) code.

If you're **developing locally** or **deploying outside the one-click flow**, that
step doesn't run, so you need to set the plugin up by hand. Here's how to
reproduce it.

#### 1. Make your app reachable from DatoCMS

DatoCMS is a cloud service, and the Web Previews plugin runs inside the DatoCMS
interface — not on your machine. When it needs preview links or wants to enable
Draft Mode, **DatoCMS's own servers make an HTTP request to the URLs you configure
here**. The traffic originates from DatoCMS in the cloud and has to travel _to_
your app.

That's why `http://localhost:3000` doesn't work: `localhost` means "the machine
making the request," so DatoCMS would be calling itself, not your dev server. For
DatoCMS to reach your app, the app has to be available at a public internet address.

- **Deployed app**: use its public URL (e.g. `https://your-app.example.com`).
- **Local development**: put a tunnel in front of your dev server — e.g.
  `ngrok http 3000` or `cloudflared tunnel` — which gives you a public URL that
  forwards to your local server.

In the steps below, replace `<BASE_URL>` with that public URL and `<SECRET>` with
the value of your `NUXT_SECRET_API_TOKEN` environment variable.

> If you deployed this starter with the one-click flow from the DatoCMS marketplace, that value was randomly generated for you during the setup, and shown to you on the last step of the wizard. If you no longer have it, set a new one among the environment variables of your hosting provider.

#### 2. Install the Web Previews plugin

In your DatoCMS project, go to **Settings > Plugins > Add a new plugin**, search
for **Web Previews**, and install it.

#### 3. Configure the plugin

Open the plugin's settings and add a single frontend:

| Setting                                    | Value                                             |
| ------------------------------------------ | ------------------------------------------------- |
| **Name**                                   | `Production`                                      |
| **Preview webhook URL**                    | `<BASE_URL>/api/preview-links`                    |
| **Custom headers** (Preview webhook)       | Name `Authorization`, value `Bearer <SECRET>`     |
| **Enable draft mode URL** (Visual Editing) | `<BASE_URL>/api/draft-mode/enable?token=<SECRET>` |
| **Initial path** (Visual Editing)          | `/`                                               |
| **Start open**                             | enabled                                           |

Both endpoints are guarded by `NUXT_SECRET_API_TOKEN`. The preview webhook reads it from the `Authorization` header, and the enable draft mode URL from the `token` query parameter. If the token doesn't match your environment variable, the requests are rejected. The draft mode URL keeps the token in the query string because editors open it in the browser, where they can't set headers.

> **Set up before 2026-08-31?** Older versions of this starter read the token from the preview webhook URL. If your plugin settings still have `?token=` on the preview webhook URL, the sidebar previews fail with `401`. Remove the `token` parameter from that URL and add the `Authorization` custom header as shown above. Do the same for the SEO/Readability Analysis plugin: it also reads the token from the `Authorization` header now. The old URLs exposed the token in logs and in the plugin settings, so also rotate `NUXT_SECRET_API_TOKEN`.

#### 4. Verify

Open a record in DatoCMS and switch to the Web Previews / Visual Editing view. The
preview should render, and the starter's click-to-edit interaction should work.

> The same [`server/api/post-deploy/index.ts`](server/api/post-deploy/index.ts) code also configures
> other things (such as the SEO/Readability Analysis plugin) — treat it as the
> authoritative reference if you need to set those up by hand too.

### How it works

The implementation consists of three parts:

1. **Data fetching** (`composables/useQuery.ts:75`): When fetching draft content, the `contentLink: 'v1'` option embeds stega-encoded metadata into text fields
2. **ContentLink component** (`components/ContentLink/index.vue`): Creates interactive overlays and handles the Web Previews plugin integration
3. **Layout integration** (`app.vue:21`): The ContentLink component is rendered only in draft mode

For more details, see the [package documentation](https://www.npmjs.com/package/@datocms/content-link).

## How the preview links are built

The [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) calls [`/api/preview-links`](server/api/preview-links/index.ts) whenever you open a record, and shows the links it returns in the record sidebar. Which links you get depends on the record's status:

| Record status | What it means                             | Links returned                              |
| ------------- | ----------------------------------------- | ------------------------------------------- |
| `draft`       | Never published                           | **Draft version**                           |
| `published`   | No changes since the last publish         | **Published version**                       |
| `updated`     | Published, with changes not yet published | **Draft version** and **Published version** |

The plugin sends the endpoint only the _current_ version of the record, the one you're editing. That's all the **Draft version** link needs. For an `updated` record, though, the current version can disagree with what's live: if you changed a field the URL depends on (typically the slug), it gives you the new URL, while the published site still serves the old one.

For example, say you change a page's slug from `about` to `about-us` and don't publish yet. The draft is at `/page/about-us`, but the published page is still at `/page/about`. A **Published version** link built from the current version would point to `/page/about-us` and end in a 404.

So, for `updated` records only, the endpoint also fetches the published version of the record from the Content Management API, and builds the **Published version** link from it:

```ts
const { data: publishedItem } = await client.items.rawFind<AnyModel>(item.id, {
  version: 'published',
});
```

Some details worth knowing:

- The request uses the `NUXT_DATOCMS_CMA_TOKEN` token (CMA Only (Read)) and the environment the plugin is running in (`environmentId`), so it works in sandbox environments too.
- `draft` and `published` records don't trigger it: either there's no published version, or it matches the current one.
- If the request fails (for example, because `NUXT_DATOCMS_CMA_TOKEN` isn't set), the error is logged and the **Published version** link falls back to the current URL. You still get both links, but the published one may 404 if the slug changed.
- Both links go through `recordToWebsiteRoute()` in [`lib/datocms/recordInfo.ts`](lib/datocms/recordInfo.ts). When you add a model there, its preview links handle the `updated` case without further changes.

## VS Code

It is highly recommended to follow [these instructions](https://gql-tada.0no.co/get-started/installation#vscode-setup) for an optimal experience with Visual Studio Code, including features like diagnostics, auto-completions, and type hovers for GraphQL.

## <!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**

- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.

<!--datocms-autoinclude-footer end-->
