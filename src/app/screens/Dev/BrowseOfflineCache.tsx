import { Text } from "@artsy/palette-mobile"
import { useEffect, useState } from "react"
import { isTreeDirectory, tree, TreeNode } from "app/system/sync/utils/tree"
import { Screen } from "palette"

export const BrowseOfflineCache = () => {
  const [files, setFiles] = useState<Record<string, TreeNode>>({})

  useEffect(() => {
    const getAsyncTree = async () => {
      setFiles(await tree())
    }
    getAsyncTree()
  }, [])

  return (
    <Screen>
      <Screen.Header title="Offline cache" />
      <Screen.Body scroll nosafe>
        <Tree files={files} depth={0} />
      </Screen.Body>
    </Screen>
  )
}

const Tree = ({ files, depth }: { files: Record<string, TreeNode>; depth: number }) => (
  <>
    {Object.keys(files).map((path) => {
      const node = files[path]
      const subtree = isTreeDirectory(node) ? (
        <Tree files={node.children} depth={depth + 1} />
      ) : null
      return (
        <>
          <Text key={path} numberOfLines={1} ellipsizeMode="middle">
            {"__".repeat(depth)}
            {path.split("/").pop()!} <Text color="brand">{files[path].prettySize}</Text>
          </Text>
          {subtree}
        </>
      )
    })}
  </>
)
