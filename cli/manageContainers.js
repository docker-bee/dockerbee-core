import inquirer from 'inquirer';
import {  deleteContainer, getContainers, runContainer, stopContainer } from '../functions/containers.js';
import colors from 'colors';
import readline from 'readline'
import { setTimeout } from 'timers/promises';
import { createTable, field } from './home.js';

export const containersSection=()=>{
  let containerHeader = ["Name","Image","Status","Port"]
  createTable(containerHeader) 
  getContainers({all:true}).then(async(containers) => {
    const table = containers.map(c=>{
      // console.log(c)
      return [
      field(c.Names[0].slice(1),15),
      field(c.Image,15),
      field(c.State == "running" ? `\uf28b ${c.State}`.green: `\uf144 ${c.State} `.gray ,25),
      field(c.Ports.length > 0 ? c?.Ports[0].PrivatePort : "",15),
    ].join(" | ")})

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
