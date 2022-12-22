import prettyBytes from "pretty-bytes"
import { DocumentDirectoryPath, stat, readdir } from "react-native-fs"
import { forEachAsyncLinear } from "app/system/sync/utils/asyncIterators"

export type TreeFile = { name: string; size: number; prettySize: string }
export type TreeDirectory = TreeFile & { children: Record<string, TreeNode> }
export type TreeNode = TreeFile | TreeDirectory

export const tree = async (
  path: string = DocumentDirectoryPath
): Promise<Record<string, TreeNode>> => {
  const names = await readdir(path)
  const treeObj: Record<string, TreeNode> = {}
  await forEachAsyncLinear(names, async (name) => {
    const { size, isFile } = await stat(path + "/" + name)
    if (isFile()) {
      treeObj[path.replace(DocumentDirectoryPath + "/", "") + "/" + name] = {
        name,
        size,
        prettySize: prettyBytes(size),
      }
    } else {
      const children = await tree(path + "/" + name)
      const size = Object.values(children).reduce((acc, { size }) => acc + size, 0)
      treeObj[path.replace(DocumentDirectoryPath + "/", "") + "/" + name] = {
        name,
        size,
        prettySize: prettyBytes(size),
        children,
      }
    }
  })
  return treeObj
}

export const isTreeDirectory = (node: TreeNode): node is TreeDirectory => {
  return (node as TreeDirectory).children !== undefined
}
