import React from "react"
import { graphql, Link } from "gatsby"
import * as R from "ramda"
import Layout from "../components/layout"
import ArticleList from "../components/article-list"

export default function Template(props) {
  const contents = props.pageContext.contents
  const newContents = R.sortWith([R.descend(R.prop("frontmatter"))])(
    contents
  ).slice(0, 10)
  const terms = props.pageContext.terms
  return (
    <Layout taxonomies={terms} isShowTaxonomies={true}>
      <ArticleList articles={newContents} />
    </Layout>
  )
}