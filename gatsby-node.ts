import * as R from "ramda"
import { taxonomies, paging } from "./app-config"
import {getTaxonomiesName, getAllTerms } from "./taxonomy"

interface QueryResult {
  errors: string
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: {
          frontmatter: unknown
          excerpt: string
        }
      }>
    }
  }
}

// 处理 yaml frontmatter 分类的可选字段
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      ${getTaxonomiesName(taxonomies).map(item => `${item}: [String!]`).join("\n")}
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
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
              title
              ${getTaxonomiesName(taxonomies).join("\n")}
            }
          }
        }
      }
    }
    `

  const result : QueryResult = await graphql(markdownQuery)

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

  const frontmatters = R.map(content => R.path(["node","frontmatter"], content) , contents)

  const terms = getAllTerms(
    frontmatters, 
    getTaxonomiesName(taxonomies)
  )

  console.log(`terms: ${terms}`)

  R.forEachObjIndexed((terms, tax) => {
    R.forEachObjIndexed((articles, term) => {
      console.log(`term: ${term}`)
      const totalPages = Array(articles).length
      const prePage = paging.offset
      const numPages = Math.ceil(totalPages / prePage)

      Array.from({ length: numPages }).forEach((_, i) => {

        const op = {eq: `${term}`}
        const frontmatterFilterOptions : any = {}
        frontmatterFilterOptions[tax] = op

        // filter.frontmatter[tax] = { "eq": `${term}` }
        const filter = { frontmatter: frontmatterFilterOptions }        

        createPage({
          path: (i === 0 ? `/${term}` : `/${term}/${i + 1}`),
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
