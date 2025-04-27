### 3. Dropdown

````markdown
# Dropdown

A dropdown menu for selecting an option.

## Props

| Name        | Type                    | Required | Description      |
| ----------- | ----------------------- | -------- | ---------------- |
| options     | Array<{label, value}>   | Yes      | List of options  |
| value       | string                  | Yes      | Selected value   |
| onChange    | (value: string) => void | Yes      | Change handler   |
| placeholder | string                  | No       | Placeholder text |

## Example

```tsx
<Dropdown
  options={[{ label: "A", value: "a" }]}
  value={value}
  onChange={setValue}
/>
```
````
