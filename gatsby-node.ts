import * as R from "ramda"
import { taxonomies, paging } from "./app-config"
import { getTaxonomiesName, getAllTerms } from "./taxonomy"

interface QueryResult {
  errors: string
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: {
          frontmatter: Object
          excerpt: string
        }
      }>
    }
  }
}

// 处理 yaml frontmatter 分类的可选字段
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Frontmatter {
      draft: Boolean
      date(
        difference: String
        formatString: String
        fromNow: Boolean
        locale: String
      ): Date
      ${getTaxonomiesName(taxonomies)
        .map(item => `${item}: [String!]`)
        .join("\n")}
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
  `
  console.log(`typeDefs: ${typeDefs}`)
  createTypes(typeDefs)
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const markdownQuery = `
    {
      allMarkdownRemark(
        filter: {frontmatter: {draft: {ne: true}}}
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            excerpt
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              slug
              title
              description
              ${getTaxonomiesName(taxonomies).join("\n")}
            }
          }
        }
      }
    }
    `

  const result: QueryResult = await graphql(markdownQuery)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const contents = result.data.allMarkdownRemark.edges

  const articleTemplate = require.resolve(`./src/templates/article.tsx`)

  contents.forEach(({ node }) => {
    createPage({
      path: node.frontmatter["slug"],
      component: articleTemplate,
      context: {
        // additional data can be passed via context
        slug: node.frontmatter["slug"],
      },
    })
  })

  const frontmatters = R.map(
    content => R.path(["node", "frontmatter"], content),
    contents
  )

  const terms = getAllTerms(frontmatters, getTaxonomiesName(taxonomies))

  // index
  const indexTemplate = require.resolve(`./src/templates/index.tsx`)
  createPage({
    path: "/",
    component: indexTemplate,
    context: {
      terms,
      contents,
    },
  })

  console.log(`terms: ${terms}`)

  R.forEachObjIndexed((terms, tax) => {
    R.forEachObjIndexed((articles: Object, term) => {
      console.log(`term: ${term}`)
      const totalPages = Object.keys(articles).length
      const prePage = paging.offset
      const numPages = Math.ceil(totalPages / prePage)

      Array.from({ length: numPages }).forEach((_, i) => {
        const frontmatterFilterOptions: any = {}
        frontmatterFilterOptions.draft = { ne: true }
        frontmatterFilterOptions[tax] = { eq: `${term}` }

        const filter = { frontmatter: frontmatterFilterOptions }

        createPage({
          path: i === 0 ? `/${term}` : `/${term}/${i + 1}`,
          component: require.resolve(`./src/templates/list.tsx`),
          context: {
            limit: totalPages,
            skip: i * prePage,
            //paging
            prePage,
            numPages,
            currentPage: i + 1,
            // tax and term
            tax,
            term,
            filter,
          },
        })
      })
    }, terms)
  }, terms)
}
