import fs from 'fs'
import JSZip from 'jszip'
import unzipper from 'unzipper'

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

const decompressZip = async (filePath, destination, passwordProteced = '') => {
  try {
    let paths = []
    const directory = await unzipper.Open.file(filePath)
    if (!fs.existsSync(destination)) {
      fs.mkdir(destination, { recursive: true }, (e) => {
        if (e) throw e
        console.log(`File created Successfully!`)
      })
    }
    for (let file of directory.files) {
      const data = await file.buffer(passwordProteced)
      const writeStream = fs.createWriteStream(`${destination}/${file.path}`)
      writeStream.write(data)
      writeStream.on('error', (e) => console.log(e))
      writeStream.on('finish', () => console.log('writing done'))
      writeStream.close((e) => {
        if (e) console.log(e.message)
      })
      paths.push(`${destination}/${file.path}`)
    }
    return paths
  } catch (e) {
    console.log(e.message)
  }
}

export {
  initiateZipInstance,
  initiateNewArchive,
  appendFileToArchive,
  generateZipFile,
  decompressZip,
}
