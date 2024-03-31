const readline = require('readline');
const { render } = require('./render');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let selected = 0;
let lng = 0;

function startHandling(content){
  content.then((containers) => {
    lng = containers.length;
  });
  rl.input.on('keypress', (str, key) => {
    if (key && key.name === 'j') {
      selected += 1;
      if (selected === lng) {
        selected = 0;
      }
      render({
        content,
        selected
      });
    } else if (key && key.name === 'k') {
      selected -= 1;
      if (selected === -1) {
        selected = lng - 1;
      }
      render({
        content,
        selected
      });
    }
  });
}




exports.startHandling = startHandling;
exports.selected = selected;

