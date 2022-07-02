// Select all checkboxes with the name 'settings' using querySelectorAll.
var checkboxes = document.querySelectorAll(
  "input[type=checkbox][value=toggle]"
)
let enabledSettings = []
// Use Array.forEach to add an event listener to each checkbox.
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    toggleDiv(this.name)
    //console.log("Check: ", this.name)
  })
})
