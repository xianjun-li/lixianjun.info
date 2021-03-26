/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

require('ts-node').register({
  compilerOptions: {
    target: "esnext",
    strict: false,
  }
})

const appConfig = require("./app-config")
const { languages, defaultLanguage } = require('./languages')

module.exports = {
  /* Your site config here */

  siteMetadata: appConfig.siteMetadata,

  plugins: [

    // language start {
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true, // defaults to false
      },
    },
    // } language end.

    // i18n start {
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`
      }
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        languages,
        defaultLanguage,
        siteUrl: 'http://localhost:9000',
        i18nextOptions: {
          defaultNS: 'common',
          //debug: true,
          lowerCaseLng: true,
          saveMissing: false,
          interpolation: {
            escapeValue: false // not needed for react as it escapes by default
          },
          keySeparator: false,
          nsSeparator: false
        },
        pages: [
          {
            matchPath: '/ignored-page',
            languages: ['en']
          }
        ]
      }
    },
    // } i18n end.

    // content start {
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "contents",
        path: `${__dirname}/contents`,
      },
    },

    // image
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,

    // markdown
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          // gatsby-remark-videos 要在 gatsby-remark-copy-linked-files,gatsby-remark-images前
          {
            resolve: `gatsby-remark-videos-new`,
            options: {
              pipelins: [],
            }
          },

          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`, 'mp4'],
            },
          },

          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },

          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: true,
            }
          },

        ],
      },
    },
    // } content end.

    // optimize start {
    // helmet
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GatsbyJS`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#6b37bf`,
        theme_color: `#6b37bf`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `standalone`,
        icon: `static/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ['/**/404', '/**/404.html'],

      }
    },
    // } optimize end.
  ],
}
