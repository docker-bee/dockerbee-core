import inquirer from 'inquirer';
import { createContainer, deleteContainer, getContainers, runContainer, stopContainer } from '../functions/containers.js';
import colors from 'colors';
import readline from 'readline'
import { setTimeout } from 'timers/promises';
import { deleteImage, getImages } from '../functions/images.js';
import { containersSection } from './manageContainers.js';
import { imagesSection } from './manageImages.js';



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

export const createTable = (headerArray) =>{
  console.clear()
  let header = headerArray.map(h=>field(h,15)).join(" | ")
  console.log("\n  "+header)
  console.log("_".repeat(header.length))
}



export const field = (value,length) =>{
  if(!value) return
  if(value.length > length){
    return value.substring(0,length-2) + ".."
  }else{
    return value + " ".repeat(length-value.length)
  }
}


