const readline = require('readline');
const { render } = require('./render');
const { runContainer, stopContainer } = require('../functions/containers');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let selected = 0;
let lng = 0;
let data = [];

function startHandling(content){
  content.then((containers) => {
    lng = containers.length;
    data = containers
  });
  rl.input.on('keypress',async (str, key) => {
    if( key.name === 'k' ){
      selected = MoveUp(selected);
      render({content,selected});
    }else if( key.name === 'j' ){
      selected = MoveDown(selected);
      render({content,selected});
    }else if( key.name === 'r' ){
      if(data[selected].State === "running"){
          const stopping = await stopContainer(data[selected].Id);
          console.log(stopping)
          setTimeout(() => {
            render({content,selected,refresh:true});
          }, 1000);
      }else{
          const running = await runContainer(data[selected].Id);
          console.log(running)
          setTimeout(() => {
            render({content,selected,refresh:true});
          }, 1000);
      }
    }
  });
}





const MoveUp = (selected) => {
  selected -= 1;
  if (selected === -1) {
    selected = lng - 1;
  }
  return selected;
}

const MoveDown = (selected) => {
  selected += 1;
  if (selected === lng) {
    selected = 0;
  }
  return selected;
}



exports.startHandling = startHandling;
exports.selected = selected;

