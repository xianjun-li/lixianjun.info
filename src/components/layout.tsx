import React from "react"

import { useStaticQuery, graphql } from "gatsby"
import {
  Trans,
  useTranslation,
  Link,
  useI18next,
} from "gatsby-plugin-react-i18next"
import { Helmet } from "react-helmet"
import * as R from "ramda"

// import bulma from "bulma"
import "bulma/css/bulma.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "./common.css"

import { store } from "../../state-store"
// import ChangeLanguage from "../components/change-language"

function Layout({
  children,
  title = "",
  description = "",
  taxonomies = {},
  isShowTaxonomies = false,
}) {
  const { t } = useTranslation()
  // 语言及切换
  const { languages, changeLanguage } = useI18next()
  store.languages = languages
  store.changeLanguage = changeLanguage

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
        <title>{t(title)}</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="hero is-info">
        <div className="hero-head">
          <nav className="navbar">
            <div className="container">
              <input type="checkbox" id="menu-toggle" className="is-hidden" />
              <div className="navbar-brand">
                <span className="navbar-item">
                  {t(data.site.siteMetadata.title)}
                </span>
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
                          {t(title)}
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
                          <span className="button is-dark">
                            <span className="icon">
                              <i className={iconStyle}></i>
                            </span>
                            <Link to={url}>{title}</Link>
                          </span>
                        </span>
                      )
                    }
                  )}

                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">
                      <span className="icon">
                        <i className="fas fa-language"></i>
                      </span>
                      {/* <span className="">Language</span> */}
                    </a>

                    <div className="navbar-dropdown">
                      {languages.map(lng => (
                        <li key={lng} className="navbar-item">
                          <span
                            className="block"
                            style={{ color: "#333", cursor: "pointer" }}
                            onClick={e => {
                              e.preventDefault()
                              changeLanguage(lng)
                            }}
                          >
                            {lng}
                          </span>
                        </li>
                      ))}
                    </div>
                  </div>
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
                        <li className="gap">
                          <span className="icon-text">
                            <span className="icon">
                              <i className="fas fa-infinity"></i>
                            </span>
                            <span className="title">{t(`${taxPath}`)}</span>
                          </span>
                          <ul>
                            {Object.keys(terms).map(termName => {
                              return (
                                <li>
                                  <Link
                                    to={`/${termName}`}
                                    className="button is-text"
                                  >
                                    {`${termName}`
                                      .split("/")
                                      .map(s => t(s))
                                      .join("/")}
                                  </Link>
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
        <div className="level has-text-centered">
          <span className="level-item gap-level">
            {t("Author")}:{" "}
            <Link to={`//${data.site.siteMetadata.siteUrl}`}>
              {data.site.siteMetadata.author}
            </Link>
          </span>

          <span className="level-item gap-level">
            {t("Welcome to {{title}}")} {t("The website content is licensed")}{" "}
            <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
              CC BY NC SA 4.0
            </a>
          </span>
          <span className="level-item gap-level">
            {t(
              "This website is made possible by the Gatsby open source project and other open source project or resource"
            )}
            : <Link to={"/about/credits"}>{t("listing")}</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Layout
