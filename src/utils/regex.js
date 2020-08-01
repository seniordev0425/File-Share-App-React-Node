import regexpTree from 'regexp-tree'
import globToRegExp from 'glob-to-regexp'

const trimParenthesis = (str) => str.replace(/^\((.*)\)$/, '$1')

export const buildRegexPattern = (glob, forPath = false) => {
  if (forPath && glob.charAt(0) !== '/' && glob.charAt(0) !== '*') {
    glob = `/${glob}`
  }
  return globToRegExp(glob).source
}

export const splitRegexPattern = (pattern) => {
  try {
    const tree = regexpTree
      .parser
      .setOptions({ captureLocations: true })
      .parse(pattern)
    let subTree = tree.body
    let result = []
    while (subTree) {
      result = subTree.right ? [
        trimParenthesis(subTree.right.loc.source), ...result
      ] : [
        trimParenthesis(subTree.loc.source), ...result
      ]
      subTree = subTree.left
    }
    return result
  } catch (ex) {
    return []
  }
}

export const joinRegexPatterns = (patterns) => {
  const joinedPatterns = patterns.map(item => `(${item})`).join('|')
  return joinedPatterns ? `/${joinedPatterns}/` : ''
}

export const cleanupRegex = (pattern) => pattern
  .replace(/\.\*/g, '*')
  .replace(/\^/g, '')
  .replace(/\$/g, '')
  .replace(/\\([^nr])/g, '$1')
  .replace(/\|/g, ', ')
