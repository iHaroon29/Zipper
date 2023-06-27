import fs from 'fs'

const readFile = async (path, output) => {
  try {
    const readStream = fs.createReadStream(path)
    readStream.pipe(output)
  } catch (e) {
    console.log(e.message)
  }
}

const writeFile = async (path, data) => {
  try {
    const writeStream = fs.createWriteStream(path)
    writeStream.write(data, (e) => {
      if (e) throw e
    })
  } catch (e) {
    return e
  }
}

const deleteFile = async (path) => {
  try {
    if (!fs.existsSync(path)) throw new Error('File Does Not exists!')
    return fs.rm(path, (err) => {
      if (err) throw new Error(`File Missing Error - ${path}`)
      console.log(`${path} has been deleted!`)
    })
  } catch (e) {
    return e
  }
}

export { readFile, writeFile, deleteFile }
