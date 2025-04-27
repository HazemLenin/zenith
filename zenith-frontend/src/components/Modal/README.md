### 4. Modal

````markdown
# Modal

A dialog/modal for displaying content.

## Props

| Name     | Type            | Required | Description                  |
| -------- | --------------- | -------- | ---------------------------- |
| title    | string          | Yes      | Modal title                  |
| children | React.ReactNode | Yes      | Modal body content           |
| footer   | React.ReactNode | No       | Modal footer (e.g., buttons) |
| open     | boolean         | Yes      | Show/hide modal              |
| onClose  | () => void      | Yes      | Close handler                |

## Example

```tsx
<Modal
  title="Confirm"
  open={open}
  onClose={closeModal}
  footer={<Button>OK</Button>}
>
  Are you sure?
</Modal>
```
````
