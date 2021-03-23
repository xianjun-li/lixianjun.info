import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import * as R from "ramda"

function ArticleList({ articles }) {
  return (
    <div>
      {articles.map(({ node }, index) => {
        return (
          <div className="container gap separateline-bottom dark">
            <div className="level is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <Link to={"/" + node.frontmatter.slug} className="title">
                    {node.frontmatter.title ||
                      node.frontmatter.slug.replace("-", " ")}
                  </Link>
                </div>
              </div>

              <div className="level-right">
                <div className="level-item">
                  <time>{node.frontmatter.date}</time>
                </div>
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: node.excerpt }}></div>
          </div>
        )
      })}
    </div>
  )
}

export default ArticleList
