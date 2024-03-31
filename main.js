const { getContainers } = require("./functions/containers");
const Table = require('cli-table');
const colors = require('colors');

const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// instantiate
const table = new Table({
    head: ['', 'name', 'image', 'status', 'created', 'ports'],
    colWidths: [5, 20, 20, 10, 20, 10]
});

let selected = 0;

const args = process.argv.slice(2);

const render = () => {
  // Clear the console by printing empty lines


  getContainers(args[1] == "all").then((containers) => {
    table.length = 0;
    containers.forEach((container, i) => {
      table.push([
        i === selected ? `\uf058`.green : `\uf10c`,
        container.Names[0], 
        container.Image, 
        container.State, 
        new Date(container.Created).toLocaleDateString() + ":" + new Date(container.Created).toLocaleTimeString(),
        container.Ports,
      ]);
    });
    console.log('\x1Bc');
    console.log(table.toString());
  });
};

rl.input.on('keypress', (str, key) => {
  if (key && key.name === 'j') {
    selected += 1;
    if (selected === table.length) {
      selected = 0;
    }
    render();
  } else if (key && key.name === 'k') {
    selected -= 1;
    if (selected === -1) {
      selected = table.length - 1;
    }
    render();
  }
});

if (args[0] === 'getContainers') {
  render();  
}
