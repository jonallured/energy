import { Flex, FlexProps } from "@artsy/palette-mobile"
import _ from "lodash"
import { defaultRules, renderMarkdown } from "utils/renderMarkdown"

interface Props {
  rules?: { [key: string]: any }
  children?: string | string[]
}

const basicRules = defaultRules({})

function stringifyChildren(children: string | string[]): string {
  return _.isArray(children) ? children.join("") : children
}

export const Markdown = ({
  rules = basicRules,
  children,
  ...rest
}: Props & FlexProps) => {
  return (
    <Flex {...rest}>
      {renderMarkdown(stringifyChildren(children ?? ""), rules)}
    </Flex>
  )
}
