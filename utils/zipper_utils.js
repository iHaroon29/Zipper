import fs from 'fs'
import JSZip from 'jszip'

const initiateZipInstance = async () => {
  return new JSZip()
}

const initiateNewArchive = async (instance, fileName = 'default') => {
  return instance.folder(fileName)
}

const appendFileToArchive = async (instance, path, fileName) => {
  try {
    const readStream = fs.createReadStream(path)
    instance.file(fileName, readStream)
  } catch (e) {
    console.log(e.message)
  }
}

const generateZipFile = async (instance, outPath, compressionLevel = 9) => {
  try {
    instance
      .generateNodeStream({
        compression: 'DEFLATE',
        compresstionOptions: { level: compressionLevel },
      })
      .pipe(outPath)
      .on('error', (e) => console.log(e.message))
  } catch (e) {
    console.log(e.message)
  }
}

const deCompress = (fileName) => {
  try {
  } catch (e) {
    console.log(e.message)
  }
}

export {
  initiateZipInstance,
  initiateNewArchive,
  appendFileToArchive,
  generateZipFile,
  deCompress,
}
