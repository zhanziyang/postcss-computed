# postcss-computed
A postcss plugin helps to write and call JavaScript functions in css for computed values.

## How to use?
### 1. Define your function:

````css
@func verticalPercent(num_h) {
  @stmt var full_h = 1336;
  @stmt if (num_h <=0) {
    @stmt return 0;
  }
  @stmt return (num_h / full_h * 100).toFixed(5) + "%";
}
````
`@func` show be placed before the function name and `@stmt` before each javascript statement. That's it!

### 2. Call your function:
````css
.box {
  height: func.verticalPercent(250);
  top: func.verticalPercent(0);
}
````
=> And you get:
````css
.box {
  height: 18.71257%;
  top: 0;
}
````
When calling functions, the function name need a `func.` prefix.

### 3. It is not necessary to write function definition before function calls.
````css
.text {
  font-size: 15px;
  line-heigth: func.lineHeight(2, 15);
}

@func lineHeight(times, fS) {
  @stmt return times * fS + "px";
}

/* compiles to: */
.text {
  font-size: 15px;
  line-heigth: 30px;
}
````