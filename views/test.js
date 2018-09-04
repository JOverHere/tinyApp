function generateRandomString() {
  var randomStr = "";
  var alphaNum ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

 for(var i = 0; i < 6; i++){
   randomStr += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
 }
 return randomStr
 console.log(randomStr)
}

console.log(generateRandomString())