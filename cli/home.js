import inquirer from 'inquirer';
import { createContainer, deleteContainer, getContainers, runContainer, stopContainer } from '../functions/containers.js';
import colors from 'colors';
import readline from 'readline'
import { setTimeout } from 'timers/promises';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



const sections = [
  {
    name:"containers",
  },
  {
    name:"images",
  },
  {
    name:"networks",
  },
  new inquirer.Separator(),
  {
    name:"exit",
  }
]

const sectionsObj = {
  "containers":"\uf4b7  containers",
  "images":"\uf03e  images",
  "networks":"\uf20e  networks",
  "exit":"\uf426  exit",
}

export async function home(){
  console.clear()
 const section = await inquirer
  .prompt({
    type:"list",
    name: "action",
    message : " ",
    choices: sections.map(section => 
      section instanceof inquirer.Separator ? section :
      sectionsObj[section.name])
  })

  if(section.action === sectionsObj.containers){
    containersSection()
  }  
}

const containersSection=()=>{
  console.clear()
  console.log("  "+field("Name",15)+" | "+field("Image",15)+" | "+field("Status",9)+" | "+field("Port",15))
  console.log("______________________________________________________")
  getContainers({all:true}).then(async(containers) => {
    const table = containers.map(c=>[
      field(c.Names[0].slice(1),15),
      field(c.Image,15),
      (c.State == "running" ? `\uf28b ${c.State}`.green: `\uf144 ${c.State} `.gray ),
      field(c.Ports.length > 0 ? c?.Ports[0].PrivatePort : "",15),
    ].join(" | "))

    const Selectcontainers = await inquirer.prompt({
        type:"list",
        name: "action",
        message : " ",
        choices:containers.map((_,i)=>({name:table[i],value:_.Id})),
        pageSize:15,
        loop:false,
      })
    
    const action = await inquirer.prompt({
      type:"list",
      name: "action",
      message : " ",
      choices:[
        {name:"\uf144 Run".green,value:"run"},
        {name:"\uf28d Stop",value:"stop"},
        {name:"\uf1f8 Delete".red,value:"delete"},
        new inquirer.Separator(),
        {name:"Quit",value:"quit"},
      ]
    })

    switch(action.action){
      case "run":
        await runContainer(Selectcontainers.action)
        containersSection()
        break;
      case "stop":
        await stopContainer(Selectcontainers.action)
        await setTimeout(()=>{},3000)
        containersSection()
        break;
      case "delete":
        await deleteContainer(Selectcontainers.action,containers.find(c=>c.Id == Selectcontainers.action).State == "running")
        await setTimeout(()=>{},3000)
        containersSection()
        break;
      case "quit":
        containersSection()
        break;
    }







  })

  




}

const field = (value,length) =>{
  if(value.length > length){
    return value.substring(0,length-2) + ".."
  }else{
    return value + " ".repeat(length-value.length)
  }
}


