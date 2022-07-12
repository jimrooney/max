function init() {
    root.showButtons()
}
function sendMail() {}
// var getJSON = function(url, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.responseType = 'json';
//     xhr.onload = function() {
//       var status = xhr.status;
//       if (status === 200) {
//         callback(null, xhr.response);
//       } else {
//         callback(status, xhr.response);
//       }
//     };
//     xhr.send();
// };


// async function fetchDataAsync(url) {
//     const response = await fetch(url, {
//         method: 'HEAD',
//         mode: 'no-cors'
//       });
//     // console.log(await response.json());
//     console.log(await response + " done")
// }

// fetchDataAsync(url)


// getJSON(url,
// function(err, data) {
//   if (err !== null) {
//     alert('Something went wrong: ' + err);
//   } else {
//     alert('err, ' + err + ' data: ' + data);
//   }
// });