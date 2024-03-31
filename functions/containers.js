
const Docker = require('dockerode');
const docker = new Docker();

const getContainers = async (all) => {
  try {
    const containers = await docker.listContainers({all});
    return(containers);
  } catch (err) {
    return(err);
  }
}


const createContainer = async (req, res) => {
  try {
    const imageName = req.body.image_name;
    const container = await docker.createContainer({
      Image: imageName,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
    });
    await container.start();
    res.send('Container created successfully!');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
}



exports.createContainer = createContainer;
exports.getContainers = getContainers;

