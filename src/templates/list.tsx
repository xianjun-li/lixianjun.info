import React from "react"
import { graphql, Link } from "gatsby"
import * as R from "ramda"
import { getTaxonomiesName } from "../../taxonomy"

export default function Template(props) {

  const { numPages, currentPage, term } = props.pageContext
  const isFirst = (currentPage === 1)
  const isLast = (currentPage === numPages)
  const prevPage = (currentPage - 1 === 1 ? 0 : (currentPage - 1))
  const nextPage = (currentPage + 1)

  const contents = R.pathOr(
    "pageResources.json.data.allMarkdownRemark.edges".split("."),
    props,
    []
  )

  return <div>
    <h1>{term} Index</h1>
    {/* <pre>
      props {JSON.stringify(props)}
      contents {JSON.stringify(contents)}
    </pre> */}
    {/* 内容列表 */}
    <ul>
      {
        contents.map(({ node }, index) => {
          return <li style={{ border: "1px solid red;", margin: "5px", background: "red" }}>
            <p>
              <Link to={"/" + node.frontmatter.slug}>
                {node.frontmatter.title || node.frontmatter.slug.replace("-", " ")}
              </Link>
            </p>
            <div dangerouslySetInnerHTML={{ __html: node.excerpt }}>
            </div>
          </li>
        })
      }
    </ul>

    {/* 分页 */}
    <ul>
      {(numPages > 1) && Array.from({ length: numPages }, (_, i) => (
        <li>
          <Link to={i === 0 ? `/${term}` : `/${term}/${i + 1}`}> {i + 1} </Link>
        </li>
      ))}
    </ul>
  </div >
}

// 页面查询
export const pageQuery = graphql`
query($skip:Int!, $limit: Int!, $filter: MarkdownRemarkFilterInput){
  allMarkdownRemark(
    filter: $filter
    sort: { fields : [frontmatter___date], order: DESC}
    limit: $limit
    skip: $skip
  ) {
    edges {
      node {
        excerpt(format:HTML)
        frontmatter{
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