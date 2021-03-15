import * as R from "ramda"

const VOCABULARY_CONTROLLED_TYPE = "controlled" //受控词汇类型
const VOCABULARY_TAXONOMY_TYPE = "taxonomy" //层次分类词汇类型
const VOCABULARY_TAG_TYPE = "tag" //标签词汇类型

type Term = string
type TermList = Term[]

// 词汇表

interface VocabularyType {
    name: string
    type: string
    // terms: TermList
}

// 词汇表列表
type VocabularyList = VocabularyType[]

// todo 移除
export const taxonomies: VocabularyList = [
    { name: "categories", type: VOCABULARY_TAXONOMY_TYPE },
    { name: "series", type: VOCABULARY_CONTROLLED_TYPE },
    { name: "tags", type: VOCABULARY_TAG_TYPE },
]

export function getTaxonomiesName(taxonomies: VocabularyList): string[] {
    return R.map(item => `${item["name"]}`, taxonomies)
}

 function getAllTerms(frontmatters: unknown[], taxonomies: string[]): Object {
  const terms = {}

    frontmatters.forEach( frontmatter => {
        // R.map(item => {item.name}, taxonomies)
        taxonomies.map((tax) => {
            if (frontmatter[tax]) {
                if (tax in terms === false) {
                    terms[tax] = []
                }
                frontmatter[tax].forEach((term) => {
                    if (term in terms[tax] === false) {
                        terms[tax][term] = []
                    }

                    terms[tax][term].push(
                        frontmatter["slug"]
                    )
                })

            }
        })
    })

    return terms
}

export {
    getAllTerms
}