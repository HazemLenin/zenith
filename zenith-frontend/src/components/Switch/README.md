### 7. Switch

````markdown
# Switch

A toggle switch for on/off states.

## Props

| Name     | Type                       | Required | Description    |
| -------- | -------------------------- | -------- | -------------- |
| checked  | boolean                    | Yes      | Switch state   |
| onChange | (checked: boolean) => void | Yes      | Change handler |
| label    | string                     | No       | Optional label |

## Example

```tsx
<Switch checked={on} onChange={setOn} label="Enable feature" />
```
````
