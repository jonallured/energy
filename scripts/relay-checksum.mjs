#!/usr/bin/env node

// @ts-check

import fs from "fs"
import sha1sum from "sha1-sum"
import sha1 from "sha1"

const QUERIES_FILE = "src/app/system/sync/syncManager.ts"
const CHECKSUM_FILE = "src/app/system/sync/_generatedRelayChecksum.ts"

const mapAsyncLinear = async (items, callback) => {
  const data = []
  for (const [index, item] of items.entries()) {
    data.push(await callback(item, index))
  }
  return data
}

const calculateChecksum = async () => {
  const content = fs.readFileSync(QUERIES_FILE, "utf-8")

  const gqlFiles = content.match(/(__generated__\/.*)/g)
  if (!gqlFiles) {
    throw new Error("No graphql files found. Are you pointing to the right QUERIES_FILE?")
  }

  const paths = gqlFiles.map((file) => `src/${file.slice(0, -1)}.ts`)

  const checksums = await mapAsyncLinear(paths, async (path) => await sha1sum(path))
  const finalChecksum = sha1(checksums.join("\n"))

  return finalChecksum
}

const updateFile = async (checksum) => {
  const content = fs.readFileSync(CHECKSUM_FILE, "utf-8")
  const updatedContent = content.replace(/(= ")(.*)(")/, `$1${checksum}$3`)
  fs.writeFileSync(CHECKSUM_FILE, updatedContent)
}

const main = async () => {
  try {
    const checksum = await calculateChecksum()
    await updateFile(checksum)
  } catch (e) {
    console.error(e)
  }
}

main()
