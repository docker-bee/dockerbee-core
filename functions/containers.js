
import  Docker from 'dockerode'
const docker = new Docker();

const getContainers = async (all) => {
  try {
    const containers = await docker.listContainers({all});
    return(containers);
  } catch (err) {
    return(err);
  }
}


const createContainer = async (name ) => {
  try {
    const container = await docker.createContainer({
      Image: name,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
    });
    await container.start();
  } catch (err) {
    return err;
  }
}


const runContainer = async (id) => {
  try {
    const container = docker.getContainer(id);
    await container.start();
    return "Container started";
  } catch (err) {
    return err;
  }
}

const stopContainer = async (id) => {
  try {
    const container = docker.getContainer(id);
    await container.stop();
    return "Container stopped";
  } catch (err) {
    return err
  }
}



const deleteContainer = async (id,stopfirst) => {
  try {
    const container = docker.getContainer(id);
    if(stopfirst){
      await container.stop();
    }
    await container.remove();
    return "Container deleted";
  } catch (err) {
    console.log(err)
    return err
  }
}



// get logs of a container max 10 last lines
const getLogs = async (id) => {
  try {
    const container = docker.getContainer(id);
    const logs = await container.logs({stdout: true, stderr: true, tail: 10, follow: false});
    return logs;
  } catch (err) {
    return err;
  }
}



export {
  getContainers,
  createContainer,
  runContainer,
  stopContainer,
  getLogs,
  deleteContainer,
}

