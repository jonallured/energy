import { Flex, FlexProps } from "@artsy/palette-mobile"
import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import _ from "lodash"

interface Props {
  rules?: { [key: string]: any }
  children?: string | string[]
}

const basicRules = defaultRules({})

function stringifyChildren(children: string | string[]): string {
  return _.isArray(children) ? children.join("") : children
}

export const Markdown = ({ rules = basicRules, children, ...rest }: Props & FlexProps) => {
  return <Flex {...rest}>{renderMarkdown(stringifyChildren(children ?? ""), rules)}</Flex>
}
