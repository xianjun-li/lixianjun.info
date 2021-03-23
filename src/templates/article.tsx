import React from "react"
import { graphql, Link } from "gatsby"
import * as R from "ramda"
import { taxonomies } from "../../app-config"
import { getTaxonomiesName, getAllTerms } from "../../taxonomy"
import Layout from "../components/layout"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  const taxonomiesName = getTaxonomiesName(taxonomies)

  const terms = getAllTerms([frontmatter], taxonomiesName)

  return (
    <Layout
      title={frontmatter.title}
      description={frontmatter.description}
      taxonomies={terms}
    >
      <h1 className="title separateline-bottom dark">
        <Link to={`/${frontmatter.slug}`}>
          {frontmatter.title || frontmatter.slug.replace("-", " ")}
        </Link>
      </h1>

      <time className="subtitle is-6">Date: {frontmatter.date}</time>

      {/* 分类与标签 */}
      <ul className="level gap separateline-bottom dark">
        {R.toPairs(terms).map((term, _) => {
          const [taxPath, terms] = term
          return (
            <li className="level-item level-left">
              {taxPath}:
              <ul className="tags are-normal">
                {Object.keys(terms).map(termName => {
                  return (
                    <span className="tag is-info is-light">
                      <Link to={`/${termName}`}>{`${termName}`}</Link>
                    </span>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>

      <div className="content" dangerouslySetInnerHTML={{ __html: html }}></div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
        categories
        series
        tags
      }
    }
  }
`
