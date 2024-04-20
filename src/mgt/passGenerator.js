//passwordGenerator

const crypto = require('pbkdf2')
const bigInt = require("big-integer");

//render password chars
const characterSubsets = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
};

function getSetOfCharacters(rules) {
  if (typeof rules === "undefined") {
    return (
      characterSubsets.lowercase +
      characterSubsets.uppercase +
      characterSubsets.digits +
      characterSubsets.symbols
    );
  }
  let setOfChars = "";
  rules.forEach(rule => {
    setOfChars += characterSubsets[rule];
  });
  return setOfChars;
}

function getOneCharPerRule(entropy, rules) {
  let oneCharPerRules = "";
  let consumedEntropy = entropy;
  rules.forEach(rule => {
    const password = consumeEntropy(
      "",
      consumedEntropy,
      characterSubsets[rule],
      1
    );
    oneCharPerRules += password.value;
    consumedEntropy = password.entropy;
  });
  return { value: oneCharPerRules, entropy: consumedEntropy };
}

function getRules(options) {
  return ["lowercase", "uppercase", "digits", "symbols"].filter(
    rule => options[rule]
  );
}

function insertStringPseudoRandomly(initialString, entropy, stringToInsert) {
  let consumedEntropy = entropy;
  let string = initialString;
  for (let i = 0; i < stringToInsert.length; i += 1) {
    const longDivision = consumedEntropy.divmod(string.length);
    string =
      string.slice(0, longDivision.remainder) +
      stringToInsert[i] +
      string.slice(longDivision.remainder);
    consumedEntropy = longDivision.quotient;
  }
  return string;
}

//render password entropy
function consumeEntropy(
  generatedPassword,
  quotient,
  setOfCharacters,
  maxLength
) {
  let passwordBuilt = generatedPassword;
  if (passwordBuilt.length >= maxLength) {
    return { value: passwordBuilt, entropy: quotient };
  }
  const longDivision = quotient.divmod(setOfCharacters.length);
  passwordBuilt += setOfCharacters[longDivision.remainder];
  return consumeEntropy(
    passwordBuilt,
    longDivision.quotient,
    setOfCharacters,
    maxLength
  );
}
//render password

function renderPassword(entropy, options) {
  const rules = getRules(options);
  const setOfCharacters = getSetOfCharacters(rules);
  const generatedPassword = consumeEntropy(
    "",
    bigInt(entropy, 16),
    setOfCharacters,
    options.length - rules.length
  );
  const charactersToAdd = getOneCharPerRule(
    generatedPassword.entropy,
    rules
  );
  return insertStringPseudoRandomly(
    generatedPassword.value,
    charactersToAdd.entropy,
    charactersToAdd.value
  );
}





function pbkdf1(password, salt, iterations, keylen, digest) {
  try{
    console.log("pbkdf2");
    var key= crypto.pbkdf2Sync(password, salt, iterations, keylen,digest);
    console.log(key.toString('hex'));
    //console.log(crypto.enc.Hex.stringify(key));
    
      //return crypto.enc.Hex.stringify(key);

  }catch(err){
    console.log(err);
  }
  return key.toString('hex');
};

function calcEntropy(site,login,counter, masterPassword) {
  //const { site, login, options, crypto } = profile;
  //const defaultOptions = { counter: 1 };
  //const { counter } = options || defaultOptions;
  const salt = site + login + counter.toString(16);
  console.log(salt);
  const iterations= 4096;
  const keylen= 32;
  const digest= "sha256" ;
  console.log("entropy");
  try{
    console.log("entropy1");
    return pbkdf1(masterPassword, salt, iterations, keylen, digest);
  }catch(err){
    console.log(err);
  }
  
}

export function generatePassword(masterPassword,website,username,lowercase,uppercase,digits,symbols,length,counter) {
  console.log("PG: ", masterPassword);
  console.log("PP: ",website);
//   const {
//     site,
//     login,
//     length,
//     counter,
//     lowercase,
//     uppercase,
//     digits,
//     symbols,
//   } = passwordProfile;
  const options = { length, counter, lowercase, uppercase, digits, symbols };
  const entropy = calcEntropy(website,username,counter, masterPassword);
  
  return renderPassword(entropy, options);
  
}
