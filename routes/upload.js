import express from "express"
import fs from "fs"
import rimraf from "rimraf"
import mkdirp from "mkdirp"
import multiparty from "multiparty"

// paths & constants
const fileInputName = process.env.FILE_INPUT_NAME || "qqfile"
const publicDir = process.env.publicDir
const nodeModulesDir = process.env.NODE_MODULES_DIR
const uploadedFilesPath = process.env.UPLOADED_FILES_DIR
const chunkDirName = "chunks"
const maxFileSize = process.env.MAX_FILE_SIZE || 0 // in bytes; 0 for unlimited

const onUpload = (req, res) => {
  res.send('YOOOOOOOO THIS IS CONNECTING')
  // const form = new multiparty.Form()
}

export default onUpload
