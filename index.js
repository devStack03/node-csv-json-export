const http = require('http')
const exportFromJSON = require('export-from-json')
const ethers = require('ethers')
const zipCodes = require('./zipcode')
const address = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
let exportData = [];
zipCodes.forEach((code) => {
  const BigNumber = ethers.BigNumber
  const utils = ethers.utils
  const labelHash = utils.keccak256(utils.toUtf8Bytes(code))
  const tokenId = BigNumber.from(labelHash).toString()

  exportData.push({
    zipcode: code,
    url: `https://opensea.io/assets/ethereum/${address}/${tokenId}`,
  })
});

http
  .createServer(function (request, response) {
    const fileName = 'zipcode-ether-list'
    const exportType = 'json'
    // const exportType = 'csv';
    const result = exportFromJSON({
      data: exportData,
      fileName,
      exportType,
      processor(content, type, fileName) {
        switch (type) {
          case 'txt':
            response.setHeader('Content-Type', 'text/plain')
            break
          case 'css':
            response.setHeader('Content-Type', 'text/css')
            break
          case 'html':
            response.setHeader('Content-Type', 'text/html')
            break
          case 'json':
            response.setHeader('Content-Type', 'text/plain')
            break
          case 'csv':
            response.setHeader('Content-Type', 'text/csv')
            break
          case 'xls':
            response.setHeader('Content-Type', 'application/vnd.ms-excel')
            break
        }
        response.setHeader(
          'Content-disposition',
          'attachment;filename=' + fileName,
        )
        return content
      },
    })

    response.write(result)
    response.end()
  })
  .listen(3001, '127.0.0.1')
