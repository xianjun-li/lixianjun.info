export const taxonomies = [
    { name: "categories", type: "taxonomy" },
    { name: "series", type: "controlled" },
    { name: "tags", type: "tag" }
]

export const paging = {
    // 每页记录数
    offset: 10,
}

export const siteMetadata = {
    title: "我的博客",
    author: "your name",
    siteUrl: "localhost:8000",
    description: `description`,
    navigator: {
        main: {
            start: [
                {title:"Home", url:"/", iconStyle:""},
            ],
          end: [
                {title:"Github", url:"//github.com", iconStyle:"fab fa-github"},
          ],  
    }
    },
  }