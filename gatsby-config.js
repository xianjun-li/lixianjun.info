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

module.exports = {
  /* Your site config here */

  siteMetadata: appConfig.siteMetadata,

  plugins: [

    // base plugins -----------

    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true, // defaults to false
      },
    },

    // gatsby-source-filesystem
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/contents`,
      },
    },

    // helmet
    `gatsby-plugin-react-helmet`,

    //image
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,

    // markdown ---------
    // markdown content
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
  ],
}
