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
              <div className="navbar-brand">
                <a className="navbar-item">
                  {/* <img src="https://bulma.io/images/bulma-type-white.png" alt="Logo"> */}
                </a>
              </div>
              <div className="navbar-menu">
                <div className="navbar-end">
                  <Link to={`/`} className="navbar-item is-active">
                    Home
                  </Link>
                  <span className="navbar-item">
                    <a className="button is-dark">
                      <span className="icon">
                        <i className="fab fa-github"></i>
                      </span>
                      <Link to="//github.com">Github</Link>
                    </a>
                  </span>
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
                      const [taxPath, terms] = term
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
