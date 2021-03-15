import React from "react"
import { graphql, Link } from "gatsby"
import * as R from "ramda"
import { taxonomies } from "../../app-config"
import { getTaxonomiesName, getAllTerms } from "../../taxonomy"


export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  const taxonomiesName = getTaxonomiesName(taxonomies)

  const terms = getAllTerms([frontmatter], taxonomiesName)

  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title || frontmatter.slug.replace("-", " ")}</h1>
        <small> <a href={`/${frontmatter.slug}`}>{frontmatter.slug}</a></small>
        {/* 分类与标签 */}
        <h2>Taxonomies:</h2>
        <ul>
          {
            R.toPairs(terms)
              .map((term, _) => {
                const [taxPath, terms] = term
                return (<li>
                  <ul>
                    {taxPath}
                    {
                      Object.keys(terms).map(termName => {
                        return <li>
                          <Link to={`/${termName}`}>{`${termName}`}</Link>
                        </li>
                      })
                    }
                  </ul>
                </li>)
              })
          }
        </ul>
        <h2>{frontmatter.date}</h2>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
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
        categories
        series
        tags
      }
    }
  }
`
