const R = require("ramda")
const { taxonomies } = require(`./taxonomies.js`)
const { allTax } = require(`./src/service/tax.js`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const markdownQuery = `
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
              title
              categories
              series
              tags
            }
          }
        }
      }
    }
    `

  const result = await graphql(markdownQuery)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const contents = result.data.allMarkdownRemark.edges

  const articleTemplate = require.resolve(`./src/templates/article.js`)

  contents.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: articleTemplate,
      context: {
        // additional data can be passed via context
        slug: node.frontmatter.slug,
      },
    })
  })


  const terms = allTax(contents, taxonomies)
  console.log(terms)

  R.forEachObjIndexed((terms, tax) => {
    R.forEachObjIndexed((articles, path) => {
      const totalPages = articles.length
      const prePage = 2
      const numPages = Math.ceil(totalPages / prePage)

      Array.from({ length: numPages }).forEach((_, i) => {
        const filter = { frontmatter: {} }

        filter.frontmatter[tax] = { eq: `${path}` }

        const taxIsCategories = (tax === `categories`)
        const taxIsSeries = (tax === `series`)
        const taxIsTags = (tax === `tags`)

        createPage({
          path: (i === 0 ? `/${path}` : `/${path}/${i + 1}`),
          component: require.resolve(`./src/templates/list.js`),
          context: {
            limit: totalPages,
            skip: i * prePage,
            prePage,
            numPages,
            currentPage: i + 1,
            // tax and term
            tax: tax,
            term: path,
            taxIsCategories,
            taxIsSeries,
            taxIsTags,
            filter,
          },
        })
      })
    }, terms)
  }, terms)
}
