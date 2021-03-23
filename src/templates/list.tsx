import React from "react"
import { graphql, Link } from "gatsby"
import * as R from "ramda"
import { getTaxonomiesName } from "../../taxonomy"
import Layout from "../components/layout"
import ArticleList from "../components/article-list"

export default function Template(props) {
  const { numPages, currentPage, term } = props.pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? 0 : currentPage - 1
  const nextPage = currentPage + 1

  const contents = R.pathOr(
    [],
    "pageResources.json.data.allMarkdownRemark.edges".split("."),
    props
  )

  return (
    <Layout title={`${term} index`}>
      <h1 className="title separateline-bottom dark">{term}</h1>

      <ArticleList articles={contents} />

      {/* 分页 */}
      {numPages > 1 && (
        <nav className="pagination" role="navigation" aria-label="pagination">
          {!isFirst && (
            <Link
              className="pagination-previous"
              to={currentPage == 2 ? `/${term}` : `/${term}/${currentPage - 1}`}
            >
              Previous
            </Link>
          )}

          {!isLast && (
            <Link
              className="pagination-next"
              to={`/${term}/${currentPage + 1}`}
            >
              Next page
            </Link>
          )}

          <ul className="pagination-list">
            {Array.from({ length: numPages }, (_, i) => (
              <li>
                <Link
                  className={
                    `pagination-link` +
                    (currentPage == i + 1 ? " is-current" : "")
                  }
                  ariaLabel={`Goto page ${i + 1}`}
                  to={i === 0 ? `/${term}` : `/${term}/${i + 1}`}
                >
                  {i + 1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </Layout>
  )
}

// 页面查询
export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!, $filter: MarkdownRemarkFilterInput) {
    allMarkdownRemark(
      filter: $filter
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(format: HTML)
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
    }
  }
`
