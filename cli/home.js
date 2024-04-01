import inquirer from 'inquirer';
import { createContainer, deleteContainer, getContainers, runContainer, stopContainer } from '../functions/containers.js';
import colors from 'colors';
import readline from 'readline'
import { setTimeout } from 'timers/promises';
import { deleteImage, getImages } from '../functions/images.js';

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
  }else if(section.action === sectionsObj.images){
    imagesSection()
  }
}

const createTable = (headerArray) =>{
  console.clear()
  let header = headerArray.map(h=>field(h,15)).join(" | ")
  console.log(header)
  console.log("_".repeat(header.length))
}

const containersSection=()=>{
  let containerHeader = ["Name","Image","Status","Port"]
  createTable(containerHeader) 
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
    
    const isRunning = containers.find(c=>c.Id == Selectcontainers.action).State == "running"
    const action = await inquirer.prompt({
      type:"list",
      name: "action",
      message : " ",
      choices:[
        {name: !isRunning ? "\uf144 Run".green : "\uf28d Stop", value: isRunning ? "stop" : "run"},
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
        await stopContainer(Selectcontainers.action).then(()=>{
          console.log("Container stopped")})
        await setTimeout(()=>{},3000)
        containersSection()
        break;
      case "delete":
        const confirm = await inquirer.prompt({
          type:"confirm",
          name: "action",
          message : "Are you sure you want to delete this container?",
        })
        if(!confirm.action){
          containersSection()
          break;
        }
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

const imagesSection=()=>{
  let imagesHeader = ["Name","Size"]
  createTable(imagesHeader) 
  getImages().then(async(images) => {
    const table = images.map(c=>[
      field(c.RepoTags[0],15),
      field(c.Size,15),
    ].join(" | "))

    const Selectcontainers = await inquirer.prompt({
        type:"list",
        name: "action",
        message : " ",
        choices:images.map((_,i)=>({name:table[i],value:_.Id})),
        pageSize:15,
        loop:false,
      })
    
    const action = await inquirer.prompt({
      type:"list",
      name: "action",
      message : " ",
      choices:[
        {name: "Create container", value: "create"},
        {name:"\uf1f8 Delete".red,value:"delete"},
        new inquirer.Separator(),
        {name:"Quit",value:"quit"},
      ]
    })

    switch(action.action){
      case "create":
        await createContainer(Selectcontainers.action)
        imagesSection()
        break;
      case "delete":
        const confirm = await inquirer.prompt({
          type:"confirm",
          name: "action",
          message : "Are you sure you want to delete this image?",
        })
        if(!confirm.action){
          imagesSection()
          break;
        }
        await deleteImage(Selectcontainers.action)
        await setTimeout(()=>{},3000)
        imagesSection()
        break;
      case "quit":
        imagesSection()
        break;
    }
  
  })}

const field = (value,length) =>{
  if(value.length > length){
    return value.substring(0,length-2) + ".."
  }else{
    return value + " ".repeat(length-value.length)
  }
}


