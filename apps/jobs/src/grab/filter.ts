const excludeJobKeyword = ['求职']

export function isAvailableContent(text: string) {
  if (!text) {
    return false
  }
  if (excludeJobKeyword.some((keyword) => text.includes(keyword))) {
    return false
  }
  return true
}

const excludeTagKeyword = ['----', '']

export function filterAvailableTags(tags: string[] = []) {
  return tags.filter((tag) => !excludeTagKeyword.includes(tag))
}

const eleDuckExcludeCategory = [
  'jd', // 招聘
  'talent', // 人才库
  'upwork' // Upwork
]

export function isAvailableCategory(code: string) {
  if (eleDuckExcludeCategory.includes(code)) {
    return true
  }
  return false
}


