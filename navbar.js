var root = {
  addScript(src) {
    // Create a new script element
    let script = document.createElement("script")

    // Set the 'src' attribute to the URL of the JavaScript file you want to load
    script.src = src

    // Append the script element to the HTML document, which will trigger the loading of the new script
    document.head.appendChild(script)
  },
  addStyleSheet(src) {
    // Create a new link element for the CSS file
    let link
    link = document.createElement("link")
    link.rel = "stylesheet"
    link.type = "text/css"
    link.href = src

    // Append the link element to the HTML document's head
    document.head.appendChild(link)
  },
  // Clear PWA Cache
  clearCache() {
    console.log("Clearing Cache... ", caches)
    caches.keys().then(function (names) {
      for (let name of names) caches.delete(name)
    })
    console.log("Done, Cache... ", caches)
  },
  flipDemo(element) {
    this.demo = !this.demo
    const demo = this.demo
    console.log("Demo mode: ", demo)
    if (demo) {
      element.style.border = "1px solid green" // Add a border to the element
      element.style.padding = "5px" // Add padding for better appearance
      element.style.textDecoration = "none" // Remove the default underline
    } else {
      element.style.border = "1px solid red" // Add a border to the element
      element.style.padding = "5px" // Add padding for better appearance
      element.style.textDecoration = "none" // Remove the default underline
    }
  },
  toggleDiv(ID) {
    let x = ID
    if (typeof ID == "string") {
      x = document.getElementById(ID)
    }
    if (x.style.display === "none") {
      x.style.display = "block"
    } else {
      x.style.display = "none"
    }
  },
  isiOS: function () {
    return iOSCheck()
  },
  // Check for Apple
  iOSCheck() {
    const userAgent = navigator.userAgent
    const iOSDevices = ["iPhone", "iPad", "iPod"]

    for (const device of iOSDevices) {
      if (userAgent.includes(device)) {
        return true
      }
    }
    // If no iOS device is detected, return false
    return false
  },
}

//window.onload = () => {
// document.body.innerHTML =
//   `<div class="topnav">
//   <a class="active" href="index.html">Home</a>
//   <a href="performance.html">Performance</a>
//   <a href="balance.html">Balance</a>
//   </div>` + document.body.innerHTML

// JimQuery version:
$().ready(() => {
  $("<body>").prepend(
    `
    <div class="version-div">
        Version 1.3.6 [Phones]
    </div>
    <div class="topnav">
      <a class="active" href="index.html">Home</a>
      <a href="performance.html">Performance</a>
      <a href="balance.html">Balance</a>
      <a href="crosswind.html">Crosswind</a>
      <a href="test2.html">Test2</a>
      <a href="test3.html">Test3</a>
      <a href="TestArrow.html">Arrow</a>
      <a href="#" onClick="root.clearCache()">Reset Cache</a>
      <a href="DeleteCaches.html">Delete Cache</a>
      <a href="#" onClick="root.flipDemo(this)">Flip Demo</a>
    </div>
    `
  )
})

root.addStyleSheet("CSS.css")
