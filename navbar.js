//window.onload = () => {
  $().ready(()=>{
  // document.body.innerHTML =
  //   `<div class="topnav">
  //   <a class="active" href="index.html">Home</a>
  //   <a href="performance.html">Performance</a>
  //   <a href="balance.html">Balance</a>
  //   </div>` + document.body.innerHTML

  // JimQuery version:
  $("body").prepend(
    `<div class="topnav">
      <a class="active" href="index.html">Home</a>
      <a href="test2.html">Test2</a>
      <a href="performance.html">Performance</a>
      <a href="balance.html">Balance</a>
      <a href="test3.html">test3</a>
      <a href="clearcache.html">Reset Cache</a>
    </div>`
  )
})
