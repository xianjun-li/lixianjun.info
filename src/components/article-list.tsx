import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Trans, useTranslation, Link } from "gatsby-plugin-react-i18next"
import * as R from "ramda"

function ArticleList({ articles }) {
  const { t } = useTranslation()
  return (
    <div>
      {articles.map(({ node }, index) => {
        return (
          <div className="container gap separateline-bottom dark">
            <div className="level is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <Link to={"/" + node.frontmatter.slug}>
                    <span className="icon-text">
                      <span className="icon">
                        {/* <i className="fas fa-rocket"></i> */}
                        <i className="fas fa-link"></i>
                      </span>
                      <span className="title">
                        {t(
                          node.frontmatter.title ||
                            node.frontmatter.slug.replace("-", " ")
                        )}
                      </span>
                    </span>
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
