export const taxonomies = [
  { name: "categories", type: "taxonomy" },
  { name: "series", type: "controlled" },
  { name: "tags", type: "tag" },
]

export const paging = {
  // 每页记录数
  offset: 10,
}

export const siteMetadata = {
  title: "Li Xianjun's Blog",
  author: "lixianjun",
  siteUrl: "https://lixianjun.info",
  description: `description`,
  navigator: {
    main: {
      start: [{ title: "Home", url: "/", iconStyle: "" }],
      end: [
        {
          title: "Github",
          url: "//github.com/xianjun-li",
          iconStyle: "fab fa-github",
        },
      ],
    },
  },
}
