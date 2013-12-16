bootsrap-wizard-ui
==================

A lightweight wizard UI for Bootstrap 3.


This plugin will progressively create a wizard ui pattern to an element, allowing for easy fallback to noscript without actually using noscript markup. For example, you would pass a container class such as $('.chunk-container') to the plugin and it will find all headers within that container for the list, then apply appropriate Bootstrap nav classes to the page, along with previous and next buttons. Each page of the wizard should have a div with a "chunk" class (that's an optional name). The plugin will handle pagination from there.

 Usage: 

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
Here's the UI with all current options explicitly set.

```javascript
$('.chunk-container').wizardBuilder({
    modifierClass: "tabs", 
    nextOption: "default",
    buttonSize: "sm",
    nextOption: "primary",
    previousOption: "default",
    headerElement: "h2",
    chunkClassName: ".chunk"
});
```
Known issues:
    - [] Doesn't play nicely if more than one wizard is on the page.
    - [] Not yet Bootstrap feature complete.
    - [] Nav doesn't like multiple headers with the same text values
