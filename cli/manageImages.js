import inquirer from 'inquirer';
import colors from 'colors';
import readline from 'readline'
import { setTimeout } from 'timers/promises';
import { createContainer, deleteImage, generateContainerNameFromImageName, getImageName, getImages } from '../functions/images.js';
import { createTable, field } from './home.js';

export const imagesSection=()=>{
  let imagesHeader = ["Name","Size"]
  createTable(imagesHeader) 
  getImages().then(async(images) => {
    const table = images.map(c=>[
      field(c.RepoTags[0],15),
      field(c.Size,15),
    ].join(" | "))

    const SelectImages = await inquirer.prompt({
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
        const imageName = await getImageName(SelectImages.action)
        const containerName = generateContainerNameFromImageName(imageName)
        await createContainer(SelectImages.action,containerName)
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
        await deleteImage(SelectImages.action)
        await setTimeout(()=>{},3000)
        imagesSection()
        break;
      case "quit":
        imagesSection()
        break;
    }
  
  })}
