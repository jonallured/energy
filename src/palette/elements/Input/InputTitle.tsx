import { Text } from "palette"

export const InputTitle: React.FC<{ optional?: boolean; required?: boolean }> = ({
  children: title,
  optional,
  required,
}) => {
  if (!title) {
    return null
  }

  return (
    <Text variant="md" style={{ fontSize: 13, marginBottom: 2, textTransform: "uppercase" }}>
      {title}
      {!!required && (
        <Text
          variant="md"
          style={{ fontSize: 13, textTransform: "none" }}
          color="onBackgroundMedium"
        >
          Required
        </Text>
      )}
      {!!optional && (
        <Text
          variant="md"
          style={{ fontSize: 13, textTransform: "none" }}
          color="onBackgroundMedium"
        >
          {" "}
          Optional
        </Text>
      )}
    </Text>
  )
}
