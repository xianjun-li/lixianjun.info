import React from "react"
import { graphql } from "gatsby"
import { Trans, useTranslation, Link } from "gatsby-plugin-react-i18next"
import * as R from "ramda"
import { getTaxonomiesName } from "../../taxonomy"
import Layout from "../components/layout"
import ArticleList from "../components/article-list"
import { transPath } from "../../helper"

export default function Template(props) {
  const { numPages, currentPage, tax, term } = props.pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? 0 : currentPage - 1
  const nextPage = currentPage + 1

  const contents = R.pathOr(
    [],
    "pageResources.json.data.allMarkdownRemark.edges".split("."),
    props
  )

  const { t } = useTranslation()

  return (
    <Layout title={`${t(term)} ${t("index")}`}>
      <div className="buttons has-addons separateline-bottom dark">
        <button className="button is-large is-dark is-selected">
          {t(`${tax}`)}:
        </button>
        <button className="button is-large is-outlined is-dark">
          <h1 className="title dark">{transPath(term, t)}</h1>
        </button>
      </div>

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
                  aria-label={`Goto page ${i + 1}`}
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
  query(
    $language: String!
    $skip: Int!
    $limit: Int!
    $filter: MarkdownRemarkFilterInput
  ) {
    locales: allLocale(
      filter: {
        ns: { in: ["common", "taxonomies", "index"] }
        language: { eq: $language }
      }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
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
