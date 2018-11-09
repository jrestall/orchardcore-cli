exports.command = 'config-cli [url]'
exports.desc = 'Set the URL of the Orchard Core instance to manage.'
exports.builder = {
  dir: {
    default: '.'
  }
}
exports.handler = function (argv) {
  console.log('config-cli called', argv.url)
}
