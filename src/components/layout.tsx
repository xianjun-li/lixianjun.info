import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql, Link } from "gatsby"
import * as R from "ramda"

import bulma from "bulma"
import "bulma/css/bulma.css"
import "./common.css"

function Layout({
  children,
  title = "",
  description = "",
  taxonomies = {},
  isShowTaxonomies = false,
}) {
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
    <div className="app">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="hero is-info">
        <div className="hero-head">
          <nav className="navbar">
            <div className="container">
              <input type="checkbox" id="menu-toggle" className="is-hidden" />
              <div className="navbar-brand">
                <a className="navbar-item">{data.site.siteMetadata.title}</a>
                {/* jsx for属性需要改为htmlFor */}
                <label htmlFor="menu-toggle" className="navbar-burger burger">
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </label>
              </div>
              <div id="ResponsiveNav" className="navbar-menu">
                <div className="navbar-start">
                  {data.site.siteMetadata.navigator.main.start.map(
                    ({ title, url, iconStyle }) => {
                      return (
                        <Link to={url} className="navbar-item">
                          {title}
                        </Link>
                      )
                    }
                  )}
                </div>
                <div className="navbar-end">
                  {data.site.siteMetadata.navigator.main.end.map(
                    ({ title, url, iconStyle }) => {
                      return (
                        <span className="navbar-item">
                          <a className="button is-dark">
                            <span className="icon">
                              <i className={iconStyle}></i>
                            </span>
                            <Link to={url}>{title}</Link>
                          </a>
                        </span>
                      )
                    }
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div
                className={`column ${
                  isShowTaxonomies
                    ? "is-8-desktop is-8-tablet separateline-right dark"
                    : ""
                } `}
              >
                {children}
              </div>

              {isShowTaxonomies && (
                <div className="column is-4-desktop is-4-tablet">
                  <ul>
                    {R.toPairs(taxonomies).map((term, _) => {
                      const [taxPath, terms] = term as [String, Object] //强制制定类型
                      return (
                        <li>
                          <ul>
                            {taxPath}
                            {Object.keys(terms).map(termName => {
                              return (
                                <li className="is-dark">
                                  <Link
                                    to={`/${termName}`}
                                  >{`${termName}`}</Link>
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hero-foot"></div>
      </section>

      <footer className="footer">
        <div className="content has-text-centered">
          <span className="gap-level">
            Provided by{" "}
            <Link to={`//${data.site.siteMetadata.siteUrl}`}>
              {data.site.siteMetadata.author}
            </Link>
          </span>

          <span className="gap-level">
            The website content is licensed
            <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
              CC BY NC SA 4.0
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Layout
