bootstrap-wizard-ui
==================

A lightweight wizard UI for Bootstrap 3.


This plugin will progressively create a wizard ui pattern to an element, allowing for easy fallback to noscript without actually using noscript markup. For example, you would pass a container class such as $('.chunk-container') to the plugin and it will find all headers within that container for the list, then apply appropriate Bootstrap nav classes to the page, along with previous and next buttons. Each page of the wizard should have a div with a "chunk" class (that's an optional name). The plugin will handle pagination from there.

 Usage:

Bootstrap Wizard UI has a data-api interface, so generally JavaScript is unecessary to build the interface. The wizard is wrapped in a `data-wizard='wizard'` section or div and each chunk has the `data-wizard='section'` set. The API requires headers within each section and will find the first header to use automatically.

 ```html
  <div data-wizard='wizard'>
      <section data-wizard='section'>
          <h2>Hello</h2>
          ...
      </section>
      <section data-wizard='section'>
          <h2>World</h2>
          ...
      </section>
  </div>
```

The plugin also, of course, works without the data-api and can be called directly with JS.

 ```html
  <section class='chunk-container'>
      <section class='chunk'>
          <h2>Hello</h2>
          ...
      </section>
      <section class='chunk'>
          <h2>World</h2>
          ...
      </section>
  </section>
```
Here's the call with all options explicitly set.

```javascript
$('.chunk-container').wizardBuilder({
    modifierClass: "tabs", 
    buttonSize: "sm",
    nextOption: "primary",
    previousOption: "default",
    justified: true,
    headerElement: "h2",
    chunkClassName: ".chunk"
});
```
Known issues:
- [] Doesn't play nicely if more than one wizard is on the page.
- [] Not yet Bootstrap feature complete.
- [] Nav doesn't like multiple headers with the same text values
