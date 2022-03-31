import fs from "fs"

const getLifeEvents = function () {
  const files = fs.readdirSync("./content/life-events/")
  return files.map((f) => f.replace(/.md$/gi, ""))
}

const sitePrefix = process.env.SITE_PREFIX ? `/${process.env.SITE_PREFIX}/` : "/"

const SITE_URLPREFIX =
  process.env.SITE_URLPREFIX || "https://federalist-edd11e6f-8be2-4dc2-a85e-1782e0bcb08e.app.cloud.gov"
const SITE_PREFIX = process.env.SITE_PREFIX || "/site/gsa/usagov-benefits-eligibility"

if (process.env.NODE_ENV !== "test") {
  console.log("SITE_URLPREFIX:", SITE_URLPREFIX)
  console.log("SITE_PREFIX:", SITE_PREFIX)
}

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Benefit finder",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Answer a few questions. Review a custom list of potential benefits. Find out how to apply.",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: sitePrefix + "favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/styles/index.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/uswds.client.js", "~/plugins/axe.client.js"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "@nuxt/content", "@nuxtjs/sitemap", "nuxt-i18n"],

  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
    vueI18n: {
      fallbackLocale: "en",
      messages: {
        en: {
          projectName: "Benefits Eligibility Awareness Resource",
          banner: {
            official: "An official website of the United States government",
            know: "Here’s how you know",
            dropdown: {
              official: "Official websites use .gov",
              officialDetailsDotGovPrefix: "A ",
              officialDetails: " website belongs to an official government organization in the United States.",
              secure: "Secure .gov websites use HTTPS",
              secureDetailsLockPrefix: "A",
              secureDetailsLockStrong: "lock",
              secureDetailsLockPostfix:
                "or https:// means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.",
            },
          },
          skipnav: "Skip to main content",
        },
        es: {
          projectName: "Buscador de beneficios",
          banner: {
            official: "Un sitio oficial del Gobierno de Estados Unidos",
            know: "Así es como usted puede verificarlo",
            dropdown: {
              official: "Los sitios web oficiales usan .gov",
              officialDetailsDotGovPrefix: "Un sitio web",
              officialDetails: " pertenece a una organización oficial del Gobierno de Estados Unidos.",
              secure: "Los sitios web seguros .gov usan HTTPS",
              secureDetailsLockPrefix: "Un",
              secureDetailsLockStrong: "candado",
              secureDetailsLockPostfix:
                "o https:// significa que usted se conectó de forma segura a un sitio web .gov. Comparta información sensible sólo en sitios web oficiales y seguros.",
            },
          },
          skipnav: "Saltar al contenido principal",
        },
      },
    },
  },

  env: {
    searchGovUrl: "https://search.usa.gov/api/v2/search/i14y",
    searchGovAccessKey: "5S6Psw6bydi_cmKJXx_v0k0Bo2WIk1aJdZzTgtDVjIg=",
    searchGovAffiliate: "bears-mvp",
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    nestedProperties: [],
    csv: {},
  },

  sitemap: {
    hostname: `${SITE_URLPREFIX}${SITE_PREFIX}`,
    routes: getLifeEvents().map((le) => `/${le}`),
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    extend(config, { isClient, isDev }) {
      if (!isDev) {
        config.output.publicPath = sitePrefix
      }
    },
  },

  generate: {
    dir: "_site",
  },

  router: {
    base: process.env.NODE_ENV !== "production" ? undefined : sitePrefix,
    linkActiveClass: "usa-current",
    linkExactActiveClass: "usa-current",
  },
}
