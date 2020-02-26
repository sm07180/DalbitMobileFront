const fs = require('fs')
const HTMLParser = require('node-html-parser')

const clientTemplateStr = fs.readFileSync('./dist/index.html').toString()
const serverTemplateStr = fs.readFileSync('./public/serverSideSnippet.html').toString()

const clientRoot = HTMLParser.parse(clientTemplateStr)
const serverRoot = HTMLParser.parse(serverTemplateStr)
// @ts-ignore
const clientBody = clientRoot.querySelector('body')

const clientOriginalChildNodes = []
clientBody.childNodes.forEach(node => {
  if (node.tagName) {
    clientOriginalChildNodes.push(node)
  }
})
clientBody['childNodes'] = []

serverRoot.childNodes.forEach((node, i) => {
  clientBody.appendChild(node)
})
// revert append
clientOriginalChildNodes.forEach(node => {
  clientBody.appendChild(node)
})

const strFinalTemplate = clientRoot.toString()
// console.log(clientRoot.querySelector('head'))
fs.writeFileSync('./dist/layout.jsp', strFinalTemplate)
