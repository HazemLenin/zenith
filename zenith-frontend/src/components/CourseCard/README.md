### 8. Course Card

```tsx
/**
 * Component that displays information about a course.
 *
 * @param {Object} props
 * @param {Object} props.course - The course object.
 * @param {number} props.course.id - The unique identifier for the course.
 * @param {string} props.course.title - The title of the course.
 * @param {string} props.course.description - A detailed description of the course.
 * @param {number} props.course.price - The price of the course.
 * @param {Object} props.course.instructor - The course instructor object.
 * @param {number} props.course.instructor.id - The course instructor unique identifier.
 * @param {string} props.course.instructor.firstName - The course instructor first name.
 * @param {string} props.course.instructor.lasttName - The course instructor last name.
 * @param {string} props.course.instructor.userName - The course instructor username.
 */
```

## Props

| Name   | Type   | Required | Description   |
| ------ | ------ | -------- | ------------- |
| course | object | Yes      | Course object |

## Example

```tsx
<CourseCard course={course} />
```
