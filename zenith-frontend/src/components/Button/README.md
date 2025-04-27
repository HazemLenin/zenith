# Button

A reusable button for user actions.

## Props

| Name     | Type                     | Required | Description               |
| -------- | ------------------------ | -------- | ------------------------- |
| children | React.ReactNode          | Yes      | Content inside the button |
| onClick  | () => void               | No       | Click handler             |
| variant  | 'primary' \| 'secondary' | No       | Button style              |
| disabled | boolean                  | No       | Disable the button        |

## Example

```tsx
<Button variant="primary" onClick={handleClick}>
  Request
</Button>
```
