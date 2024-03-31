const { getContainers } = require("./functions/containers");
const { startHandling } = require("./utils/handelKeyPress");
const { render } = require("./utils/render");







const args = process.argv.slice(2);
var content = []



if (args[0] === 'getContainers') {
  content = getContainers(true);
  startHandling(content);
  render({
    content,
    selected: 0
  });  
}



exports.content = content;
