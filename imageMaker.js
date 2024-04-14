const sharp = require('sharp');
const fs = require('fs');

//Sharp is a high-performance image processing library that allows you to manipulate images in various ways, such as resizing, cropping, and rotating.
//FS is a built-in Node.js module that allows you to work with the file system.

async function splitImage(jpegName) {
    try {
        //try is used to test a block of code for errors.
        // Load the input image
        const inputImage = await sharp(`./unprocessed/${jpegName}.png`);

        // Resize the image to 400px by 400px
        const resizedImage = await inputImage.resize(400, 400);

        //await is used to wait for a Promise. It can only be used inside an async function.
        //The python equivalent of await is await in python

        // Divide the image into 16 pieces
        const imagePieces = [];
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const piece = await resizedImage.extract({
                    left: x * 100,
                    top: y * 100,
                    width: 100,
                    height: 100,
                }).toBuffer();
                //toBuffer() method converts the image to a Buffer object.
                //We need it to be a Buffer object to save it as a file.
                imagePieces.push(piece);
                //push method adds new items to the end of an array, and returns the new length.
            }
        }

        // Save each image piece
        for (let i = 0; i < imagePieces.length; i++) {
            await sharp(imagePieces[i]).toFile(`./processed/${i + 1}.png`);
            //the ${i + 1} is used to name the files from 1 to 16.
            //the equivalent in python is f-string
        }

        console.log('Image split and saved successfully!');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Export the function
module.exports.splitImage = splitImage;

splitImage('boruto');