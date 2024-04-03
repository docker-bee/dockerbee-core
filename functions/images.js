const docker = new Docker();
import  Docker from 'dockerode'
import { getContainers } from './containers.js';

const getImages = async () => {
    try {
        const images = await docker.listImages();
        return(images);
    } catch (err) {
        return(err);
    }
}

const createImage = async (name ) => {
    try {
        const image = await docker.createImage({
            fromImage: name,
        });
        return "Image created";
    } catch (err) {
        return err;
    }
}

const deleteImage = async (id) => {
    try {
        const image = docker.getImage(id);
        await image.remove();
        return "Image deleted";
    } catch (err) {
        return err
    }
}

const createContainer = async (image,containerName='containerName') => {
    try {
      const container = await docker.createContainer({
        Image: image,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });
      await container.rename({name:containerName});
    //   set container  Names[0] =containerName 
      await 
      await container.start();
    } catch (err) {
      return err;
    }
  }

//   get image name 
const getImageName = async (id) => {
    try {
        const image = docker.getImage(id);
        const imageInfo = await image.inspect();
        return imageInfo.RepoTags[0];
    } catch (err) {
        return err
    }
}
// generateContainerNameFromImageName that takes an image name as an argument and returns a container name based on the image name. The container name should be the same as the image name, but with the prefix "container-" added to it. For example, if the image name is "nginx", the container name should be "container-nginx" and random number between 1-9999
const generateContainerNameFromImageName =  (imageName) => {
    const random = Math.floor(Math.random() * 9999) + 1;
    const newImageName = imageName.replace(/[^a-zA-Z0-9]/g, '');
    return `c-${newImageName}-${random}`;
    }

export {
    getImages,
    createImage,
    createContainer,
    generateContainerNameFromImageName,
    deleteImage,
    getImageName
}
