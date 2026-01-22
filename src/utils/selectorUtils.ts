const getStableSelector = (element: Element | null): string | null => {
  if (!element) return null

  if (element.id) {
    return `#${element.id}`
  }

  if (element.getAttribute('data-testid')) {
    return `[data-testid="${element.getAttribute('data-testid')}"]`
  }

  if (element.getAttribute('data-id')) {
    return `[data-id="${element.getAttribute('data-id')}"]`
  }

  const tagName = element.tagName.toLowerCase()
  const classes = element.className
    ? `.${element.className.split(' ').filter(Boolean).join('.')}`
    : ''

  if (classes) {
    const selector = `${tagName}${classes}`
    const matches = document.querySelectorAll(selector)
    if (matches.length === 1) {
      return selector
    }
  }

  const parent = element.parentElement
  if (parent) {
    const siblings = Array.from(parent.children)
    const index = siblings.indexOf(element)
    if (index >= 0) {
      return `${getStableSelector(parent)} > ${tagName}:nth-child(${index + 1})`
    }
  }

  return tagName
}

export const getElementSelector = (element: Element | null): string => {
  const selector = getStableSelector(element)
  return selector || 'body'
}
