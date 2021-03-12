import React from "react"
import { graphql, Link } from "gatsby"
// import * as R from "ramda"
const R = require('ramda');

// import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  const taxonomies = [
    "categories",
    "series",
    "tags",
  ]

  const terms = R.pick(taxonomies, frontmatter)
  console.log(`terms:${JSON.stringify(terms)}`)

  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title || frontmatter.slug.replace("-", " ")}</h1>
        <small> <a href={frontmatter.slug}>{frontmatter.slug}</a></small>
        {/* todo 分类与标签 */}
        <h2>Taxonomies:</h2>
        <pre>

          {/* taxonomies: {JSON.stringify(taxonomies)} */}
          {/* frontmatter: {JSON.stringify(frontmatter)} */}
          terms: {JSON.stringify(R.toPairs(terms))}
        </pre>
        <ul>
          {
            R.toPairs(terms).map((term, _) => {
              return (<li>
                {term[0]}:
                <ul>
                  {term[1].map(slug => {
                    return <li>
                      <Link to={`/${slug}`}>{slug}</Link>
                    </li>
                  })}
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
