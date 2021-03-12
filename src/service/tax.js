function allTax(markdownremarks, taxonomies) {
    const terms = {}

    markdownremarks.forEach(({ node }) => {
        taxonomies.map((tax) => {
            if (node.frontmatter[tax]) {
                if (tax in terms === false) {
                    terms[tax] = []
                }
                node.frontmatter[tax].forEach((term) => {
                    if (term in terms[tax] === false) {
                        terms[tax][term] = []
                    }

                    terms[tax][term].push(
                        node.frontmatter.slug
                    )
                })

            }
        })
    })

    return terms
}

exports.allTax = allTax