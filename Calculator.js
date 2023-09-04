class Calculator {
    constructor() {

    }
    hello(message) {
        message = (!message || message)
        alert(message.toString())
        console.log("hello")
        return "hello"
    }
}