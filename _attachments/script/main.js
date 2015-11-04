function get(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', encodeURI(url));
  // xhr.withCredentials = true;
  // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  console.log("get", url);
  var deferred = new Promise(function(resolve, reject) {
    xhr.onreadystatechange = function() {
      if (XMLHttpRequest.DONE != xhr.readyState) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      }
    };
    xhr.send("");
  });
  return deferred;
}

(function() {
  console.log("hi");
  get('http://localhost:5984/members/_design/members/_view/Party?group_level=2')
    .then(function(data) { console.log(data); });
})();
