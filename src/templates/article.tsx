import React from "react"
import { graphql } from "gatsby"
import { Trans, useTranslation, Link } from "gatsby-plugin-react-i18next"
import * as R from "ramda"
import { taxonomies } from "../../app-config"
import { getTaxonomiesName, getAllTerms } from "../../taxonomy"
import Layout from "../components/layout"
import { transPath } from "../../helper"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  const taxonomiesName = getTaxonomiesName(taxonomies)

  const terms = getAllTerms([frontmatter], taxonomiesName)
  const { t } = useTranslation()

  return (
    <Layout
      title={frontmatter.title}
      description={frontmatter.description}
      taxonomies={terms}
    >
      <div className="buttons has-addons separateline-bottom dark">
        <button className="button is-large is-dark">
          <span className="icon">
            {/* <i className="fas fa-battery-full"></i> */}
            {/* <i className="fas fa-border-none"></i> */}
            <i className="fas fa-chevron-right"></i>
          </span>
        </button>
        <button className="button is-large is-outlined is-dark">
          <h1 className="title">
            <Link to={`/${frontmatter.slug}`}>
              {frontmatter.title || frontmatter.slug.replace("-", " ")}
            </Link>
          </h1>
        </button>
      </div>

      <time className="subtitle is-6">
        <span className="gap-level">{t("Date")}:</span> {frontmatter.date}
      </time>

      {/* 分类与标签 */}
      <ul className="level gap separateline-bottom dark">
        {R.toPairs(terms).map((term, _) => {
          const [taxPath, terms] = term
          return (
            <li className="level-left">
              <span className="gap-level">{`${t(taxPath)}`}:</span>
              <ul className="tags are-normal">
                {Object.keys(terms).map(termName => {
                  return (
                    <span className="tag is-info is-light">
                      <Link to={`/${termName}`}>{`${transPath(
                        termName,
                        t
                      )}`}</Link>
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
  query($language: String!, $slug: String!) {
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
