define(function() {

  function get (url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(url));
    console.log("get:", url);
    var deferred = new Promise(function(resolve, reject) {
      xhr.onreadystatechange = function() {
        if (XMLHttpRequest.DONE === xhr.readyState) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(JSON.parse(xhr.response));
          }
        }
      };
      xhr.send("");
    });
    return deferred;
  }

  return {
    get: get
  };
});
