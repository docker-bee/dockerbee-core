const docker = new Docker();
import  Docker from 'dockerode'

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



export {
    getImages,
    createImage,
    deleteImage
}