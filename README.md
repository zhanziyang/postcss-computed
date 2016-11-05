# postcss-computed
A postcss plugin helps to write and call JavaScript functions in css for computed values.

## How to use?
### 1. Define you function in css like this.

````css
@func verticalPercent(num_h) {
  @stmt var full_h = 1336;
  @stmt if (num_h <= 0) {
    @stmt return 0;
  }
  @stmt return (num_h / full_h * 100).toFixed(5) + "%";
}
````
`@func` show be placed before the function name and `@stmt` before each javascript statement. That's it!