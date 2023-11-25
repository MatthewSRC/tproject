const { Storage } = require("@google-cloud/storage");
const stream = require("stream");

const storage = new Storage();

/**
 * Uploads a file to a specified storage bucket and returns the cloud storage URI.
 *
 * @param {object} source - The file object to upload
 * @returns {string} - The cloud storage URI of the uploaded file.
 * @throws {Error} - If an error occurs during the file upload process.
 */
async function uploadFile(source) {
  try {
    const bucket = storage.bucket(process.env.BUCKET_NAME);
    const file = bucket.file(source.originalname);

    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(source.buffer);
    passthroughStream.end();
    await new Promise((resolve, reject) => {
      passthroughStream
        .pipe(file.createWriteStream())
        .on("finish", resolve)
        .on("error", reject);
    });
    return file.cloudStorageURI.href;
  } catch (error) {
    throw error;
  }
}

/**
 * Deletes a file from a specified storage bucket.
 *
 * @param {string} source - The name of the file to be deleted.
 */
async function deleteFile(source) {
  const bucket = storage.bucket(process.env.BUCKET_NAME);
  await bucket.file(source).delete();
}

module.exports = {
  uploadFile,
  deleteFile,
};
