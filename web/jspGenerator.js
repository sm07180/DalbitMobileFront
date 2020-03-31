const fs = require('fs')
const HTMLParser = require('node-html-parser')

const clientTemplateStr = fs.readFileSync('./dist/index.html').toString()
const serverTemplateStr = fs.readFileSync('./public/serverSideSnippet.html').toString()

const clientRoot = HTMLParser.parse(clientTemplateStr)
const serverRoot = HTMLParser.parse(serverTemplateStr)
// @ts-ignore
const clientBody = clientRoot.querySelector('body')
// @ts-ignore

const clientBodyOriginalChildNodes = []
clientBody.childNodes.forEach(node => {
  if (node.tagName) {
    clientBodyOriginalChildNodes.push(node)
  }
})
clientBody['childNodes'] = []

serverRoot.childNodes.forEach((node, i) => {
  clientBody.appendChild(node)
})
// revert append
clientBodyOriginalChildNodes.forEach(node => {
  clientBody.appendChild(node)
})

let strFinalTemplate = clientRoot.toString()
const defaultJSPInitString = `<%@ page contentType="text/html;charset=UTF-8" language="java" %>\n`
const defaultIPChekcer = `<%
  String serverIp = "";
  try {
      java.net.InetAddress ip = java.net.InetAddress.getLocalHost();
      serverIp = ip.getHostAddress();
  }catch (Exception e){}
  if(!com.dalbit.util.DalbitUtil.isEmpty(serverIp)){
%><meta name="viewport2" content="<%=serverIp.substring(serverIp.length() - 1)%>" /><%
  }
%>`
const headTagIndex = strFinalTemplate.indexOf('<head>')
const headTagLength = '<head>'.length
const splitedFront = strFinalTemplate.slice(0, headTagIndex + headTagLength)
const splitedBack = strFinalTemplate.slice(headTagIndex + headTagLength)
const docType = '<!DOCTYPE html>'
strFinalTemplate = docType + splitedFront + defaultIPChekcer + splitedBack

fs.writeFileSync('./dist/layout.jsp', defaultJSPInitString)
fs.appendFileSync('./dist/layout.jsp', strFinalTemplate)
