### 2. Input

````markdown
# Input

A text input field with optional label and icon.

## Props

| Name        | Type            | Required | Description                           |
| ----------- | --------------- | -------- | ------------------------------------- |
| label       | string          | No       | Label above the input                 |
| value       | string          | Yes      | Input value                           |
| onChange    | (e) => void     | Yes      | Change handler                        |
| placeholder | string          | No       | Placeholder text                      |
| type        | string          | No       | Input type (e.g., 'text', 'password') |
| icon        | React.ReactNode | No       | Optional icon (e.g., eye icon)        |
| required    | boolean         | No       | If true, shows a required asterisk    |

## Example

```tsx
<Input
  label="Password"
  type="password"
  placeholder="Enter password"
  icon={<EyeIcon />}
/>
```

## Notes

- When the `required` prop is set to `true`, the input label will display a required asterisk (\*).
````
