const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initially

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle colour to grey
setIndicator("#ccc");
// set password length and reflect it on UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
    
    


function getRndInteger(min,max) {

    // floor method is used to round off decimals to integers 
    
    // Math.random gives numbers between 0 to 1 , when we multiply it with max-min it gives no. between 0 to max-min but we want no. between min and max so we add min to 0 and max-min 

  return Math.floor( Math.random() * (max - min) + min);

}
function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
    // ascii value of lowercase a is 97 and z is 123.
    // String.fromCharCode() converts ascii value integer into that alphabet.
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
    // ascii value of uppercase a is 65 and z is 91.
    // String.fromCharCode() converts ascii value integer into that alphabet.
}

function generateSymbol() {
    // generate a random number in the range 0 to length of string and then access the symbol at that index .
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
      await  navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "Copied!";
    } catch (error) {
        copyMsg.innerText = "Failed";
    }
    // to make copy text visible.
    copyMsg.classList.add("active");
    // to make it invisible after few seconds

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
    
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() =>{
    // if passworddisplay is non empty then
    if(passwordDisplay.value)
    copyContent();
} )



function handleCheckBoxChange() {
    checkCount = 0 ;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    }); 
}

// special condition

if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider(); // to display the change on UI.
}

allCheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
// generate password

generateBtn.addEventListener('click',()=>{
// if none of the checkbox are selected.
if (checkCount ==0) {
    return;
}

// special condition.

if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
}

//  to generate new password , remove the previous password.
console.log("Starting the Journey");
password = "";

// put the criteria accoring to checkboxes.

// if(uppercaseCheck.checked) {
//     password += generateUpperCase();
// }

// if(lowercaseCheck.checked) {
//     password += generateLowerCase();
// }

// if(numbersCheck.checked) {
//     password += generateRandomNumber();
// }

// if(symbolsCheck.checked) {
//     password += generateSymbol();
// }

let funcArr =[];

if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addtion.(the checked box parameters)

    for (let index = 0; index < funcArr.length; index++) {
        password += funcArr[index]();    
    }
    console.log("COmpulsory adddition done");
    // remaining addition. when the length of the password is greater than the checked parameters then after adding the checked ones once we have to add other parameters randomly.

    for (let index = 0; index < passwordLength-funcArr.length; index++) {
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
        
    }
    console.log("Remaining adddition done");
    // shuffle the password

    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate strength

    calcStrength();

})