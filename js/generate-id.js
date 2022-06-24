// GENERATE UNIQUE ID
function uniqueID() {
    var randomNumber = 'xxx-xxx-xxx'.replace(/[x]/g, function() {
       return (Math.random() * 9 | 0).toString();
    });
    return randomNumber;
  }