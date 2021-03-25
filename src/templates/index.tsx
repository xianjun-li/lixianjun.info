import React from "react"
import {
  Trans,
  useTranslation,
  // Link,
  useI18next,
  I18nextContext,
} from "gatsby-plugin-react-i18next"
import { graphql } from "gatsby"
import * as R from "ramda"
import Layout from "../components/layout"
import ArticleList from "../components/article-list"

export default function Template(props) {
  const contents = props.pageContext.contents
  // const newContents = R.sortWith([R.descend(R.prop("frontmatter"))])(
  //   contents
  // ).slice(0, 10)
  const newContents = R.slice(0, 10, contents)
  const terms = props.pageContext.terms

  return (
    <Layout taxonomies={terms} isShowTaxonomies={true}>
      <ArticleList articles={newContents} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($language: String!) {
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
    site {
      siteMetadata {
        title
        siteUrl
        author
        description
        navigator {
          main {
            start {
              title
              url
              iconStyle
            }
            end {
              title
              url
              iconStyle
            }
          }
        }
      }
    }
  }
`
