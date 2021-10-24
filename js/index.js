if (document.URL.slice(0, 29) === "https://www.youtube.com/watch") {
  let timeout = setInterval(() => {
    let list = document.querySelectorAll(
      "#items > ytd-item-section-renderer > #contents>ytd-compact-video-renderer"
    );

    let val = document.querySelector("#search-input>#search").value;
    val = val.toLowerCase();

    for (let i = 0; i < list.length; i++) {
      let element_text = list[i].querySelector(
        "#dismissible > .details > .metadata > a > h3 > span"
      ).textContent;
      element_text = element_text.toLowerCase();

      if (!element_text.includes(val)) {
        list[i].remove();
      }
    }
  }, 100);

  setTimeout(() => {
    clearInterval(timeout);
    let loader = document.querySelectorAll("ytd-continuation-item-renderer");
    for (let i = 0; i < loader.length; i++) {
      loader[i].remove();
    }
  }, 5000);
}
console.log("hello world");
