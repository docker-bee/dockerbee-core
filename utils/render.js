const Table = require('cli-table');
const colors = require('colors');

// instantiate
const table = new Table({
    head: ['', 'name', 'image', 'status', 'created', 'ports'],
    colWidths: [5, 20, 20, 10, 20, 10]
});


const menu = new Table({
    head: [
  '\uf04b Run(r)'.green,
  '\uf0fe Create(c)'.blue,
  '\uf1f8 Delete(d)'.red,
],
    colWidths: [15, 15,15]
});



const render = ({content,selected}) => {
  content.then((containers) => {
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
    console.log(menu.toString());
  });

};



module.exports = {
  render,
  table
}

