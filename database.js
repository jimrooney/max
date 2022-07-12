var db

document.addEventListener(
  "DOMContentLoaded",
  function () {
    //No support? Go in the corner and pout.
    if (!("indexedDB" in window)) return

    const name = "my_people"
    //indexedDB.deleteDatabase(name)
    let openRequest = indexedDB.open(name, 1)

    openRequest.onupgradeneeded = function (e) {
      console.log("upgradeneeded")
      const thisDB = e.target.result

      if (!thisDB.objectStoreNames.contains("people")) {
        thisDB.createObjectStore("people", { autoIncrement: true })
      }
    }

    openRequest.onsuccess = function (e) {
      console.log("indexedDB.open running onsuccess")

      db = e.target.result

      //Listen for add clicks
      document
        .querySelector("#addButton")
        .addEventListener("click", addPerson, false)
    }

    openRequest.onerror = function (e) {
      //Do something for the error
    }
  },
  false
)

function addPerson(e) {
  const name = document.querySelector("#name").value
  const email = document.querySelector("#email").value

  console.log("About to add " + name + "/" + email)

  const transaction = db.transaction(["people"], "readwrite")
  const store = transaction.objectStore("people")

  //Define a person
  const person = {
    name: name,
    email: email,
    created: new Date(),
  }

  //Perform the add
  const request = store.add(person)

  request.onerror = function (e) {
    console.log("Error", e.target.error.name)
    //some type of error handler
  }

  request.onsuccess = function (e) {
    console.log("Woot! Did it")
  }
}
