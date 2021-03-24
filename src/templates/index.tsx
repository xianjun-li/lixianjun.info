import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
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

  const data = useStaticQuery(
    graphql`
      query {
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
  )

  return (
    <Layout
      title={data.site.siteMetadata.title}
      description={data.site.siteMetadata.description}
      taxonomies={terms}
      isShowTaxonomies={true}
    >
      <ArticleList articles={newContents} />
    </Layout>
  )
}
