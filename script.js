'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Abhishek Katti',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-01-30T21:31:17.178Z',
    '2021-01-29T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Apurv Patwardhan',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatDate=function(date,locale){
  const calcDaysPassed=(date1,date2)=>Math.round(Math.abs(date2-date1)/(1000*60*60*24));
  const daysPassed=calcDaysPassed(new Date(),date);
  console.log("daysss",daysPassed);
  if(daysPassed==0)return 'Today';
  if(daysPassed==1) return 'Yestarday';
  if(daysPassed<=7) return `${daysPassed} days ago`;
  else
  {/*
  const day=`${date.getDate()}`.padStart(2,0);
  const month=`${date.getMonth()+1}`.padStart(2,0);
  const year=`${date.getFullYear()}`;
  return`${day}/${month}/${year}`;*/
  return new Intl.DateTimeFormat(locale).format(date);
  }
}
const formatNumber=function(acc,num){
 const  options={
    style:'currency',
    currency:acc.currency,
  };
  console.log(new Intl.NumberFormat(acc.locale,options).format(num));
  return new Intl.NumberFormat(acc.locale,options).format(num);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) :acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date=new Date(acc.movementsDates[i]);
    const displayDate=formatDate(date,acc.locale);
    const formatedNum=formatNumber(acc,mov.toFixed(2))
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedNum}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {

  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formatedNum=formatNumber(acc,acc.balance.toFixed(2));
  labelBalance.textContent = `${formatedNum}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
    const formatedin=formatNumber(acc,incomes.toFixed(2));
  labelSumIn.textContent = `${formatedin}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
    const formatedout=formatNumber(acc,Math.abs(out).toFixed(2));
  labelSumOut.textContent = `${formatedout}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
let time=120;
const startLogoutTimer=function(){
  const tick=function(){
    //labelTimer.textContent=time;
    let time_min=String(Math.trunc(time/60)).padStart(2,'0');
   let time_sec=String(Math.trunc(time%60)).padStart(2,'0');
    
    labelTimer.textContent=`${time_min}:${time_sec}`;
    
    if(time===0){
      clearInterval(timer);
      labelWelcome.textContent='Login to get started';
      containerApp.style.opacity=0;
    }
    time--; 
  }
  //set time to 5min
 
  
  tick();
  timer=setInterval(tick,1000);
  //the problem is for the second time login the first time loged timer will also be 
  //running leading to un wanted counter timer which can be solved by checking whether there exists a
  //timer already if yes clear it and start new timer

  return timer;
  //call the time for every second
 
}

///////////////////////////////////////
// Event handlers
let currentAccount,timer;


/*
const no=new Date();
const day=`${no.getDate()}`.padStart(2,0);
const month=`${no.getMonth()}`.padStart(2,0);
const year=`${no.getFullYear()}`;
const hour=`${no.getHours()}`.padStart(2,0);
const minutes=`${no.getMinutes()}`.padStart(2,0);
console.log(`${day}/${month+1}/${year}`);
labelDate.textContent=`${day}/${month+1}/${year}, ${hour}
:${minutes}`*/
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
 
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
      //internationalization API
  const no=new Date();
  const options={hour:'numeric',
  minute:'numeric',
  day:'numeric',
  month:'numeric',
  year:'numeric',
  //weekday:'short',
   }
  //automatically get the locality from users browser gets the language
  const locale=navigator.language;
  labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale,options).format(no);
  //start logout timer
  if(timer)clearInterval(timer);
  timer=startLogoutTimer();
  console.log('aasddd',timer);
  // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add dates to the ui
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
    //resetting the timer
    if(timer)clearInterval(timer);
    time=120
    timer=startLogoutTimer()
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    //currentAccount.movements.push(amount);
   // currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
   
    //setting up timer for loan
    setTimeout( (a,b)=>{
      a.movements.push(b);
      a.movementsDates.push(new Date().toISOString());
      updateUI(a);
    },5000,currentAccount,amount);
   
  }
  inputLoanAmount.value = '';
  //resetting the timer
  if(timer)clearInterval(timer);
  time=120;
  timer=startLogoutTimer()
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//in js all numbers are represented internally
//as floating point number
//ex:
/*
console.log(23===23.0);
//convert string to number
console.log(+'23');
//parsing
console.log(Number.parseInt('30px'),10);//works
//only if the string starts with a number
//second parameter is radix(base)
console.log(Number.parseInt('e23'));//NaN o/p
console.log(Number.parseFloat('  2.5rem  '));
console.log(Number.parseInt('  2.5rem  '));
//not a number
console.log(Number.isNaN(20));//checks
//not  a number property
//Checking a value is number or not
console.log(Number.isFinite(20/0));
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));//true in Java script
//--------------------------------Math Rounding--
console.log(Math.sqrt(4));
console.log(Math.max(5,18,'23'));//does typr coercion but not parsing
//similarly min also works
console.log(Math.max(5,18,'23px'));
console.log(Math.PI*Number.parseFloat('10px')**2);
console.log(Math.trunc(Math.random()*6)+1);
//generate random number in a range
const randomInt=(min,max)=>Math.floor(Math.random()*(max-min)+1)+min;
console.log(randomInt(10,20));
//---------------------Rounding Integers------
console.log(Math.trunc(23.3));
console.log(Math.round(23.9));
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));
console.log(Math.floor(23.3));
console.log(Math.floor(-23.3));
//-----rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));//number of decimal places to be rounded
console.log(+(2.35).toFixed(2));
//----------------Remainder operator--------------
console.log(5%2);
//-------------------------Big Int(premitive data type)-----------------------
console.log(Number.MAX_SAFE_INTEGER);//any number larger than this can not be represented
console.log(234736473646348374837487384783748374837487384783483748374);
console.log(234736473646348374837487384783748374837487384783483748374n);//at the end n is added to indicate Big int
console.log(BigInt(234736473646348374837487384783748374837487384783483748374));//BigInt function()
//-----------------operations on BigIntegers-----------------
console.log(10000n+1000n);
//we cannot mix normal numbers with BigIntegers
//ex:
//console.log(3409823490238094293492398423840283402384n*23);//Error in the console saying 
//cant mix with BigIntegers
console.log(3409823490238094293492398423840283402384n*BigInt(23));
console.log(20n>15);//
console.log(20n===20);//False as they are different primitive types
console.log(20n==20);
console.log(20n=='20');//doest do type coerciosn true output
console.log(34092349823489234989283498234908230948+'is really big');
//sqrt doesnot work

//Divisions
console.log(10n/3n);
console.log(10/3);
//----------------------------Dates and Times---------------------------
//Create a Date
//4 ways of creating Date!!!!
const now=new Date();
console.log(now);
//parse date from date string
console.log(new Date('Jan 30 2021 22:27:27'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037,10,19,15,23,5));
//js auto corrects dates
//ex:
console.log(new Date(2037,10,33));//corrects to the 
//next date
console.log(new Date(0));//amount of milliseconds passed
//since the beginig of the Unix time
//---------working with dates------
const future=new Date(2037,10,19,15,23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDay());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getHours());
console.log(future.toISOString());
//get Timestamp
console.log(future.getTime());//number of miliseconds
//passed since 1970
console.log(new Date(2142237180000));
console.log(Date.now());//current time stamp
future.setFullYear(2040);//change the future year from 2037
//to 2040
console.log(future);
*/
//--------------Operations on Dates-------------
//find number of days passsed between dates
//const future=new Date(2037,10,19,15,23);
const calcDaysPassed=(date1,date2)=>Math.abs(date2-date1);
const days1=calcDaysPassed(new Date(2037,3,14),new Date(2037,3,24));
console.log(days1/(1000*60*60*24));
//---------------Internationalization for formating numbers-----------
const options={
  style:'currency',   //currency,percent
  unit:'celsius', //celcius
  currency:'EUR',//currency is not determined by locale string
  //useGrouping:false,//without the separators the number is printed
}
//const num=388898459.23;
//console.log('US: ',new Intl.NumberFormat('en-US',options).format(num));
//console.log('Germany: ',new Intl.NumberFormat('de-DE',options).format(num));
//-------------------Timers---------------
//settimeout(runs only once for defined time),settimeinterval(runs forever untill we stop it)
const ing=['olive','spinac']
const pizzaTimer=setTimeout((in1,in2)=>console.log(`here is our pizza with ingrediants ${in1} and ${in2}`),3000,...ing)//call back function called after a time (second argument passed to setTimeout)
console.log('waiting');//ex to prove that code excecution doesnt stop for timeout timer
//(Asynchronous JS property)
//here call back executed only once
//gives output after a defined time
//arguments passed after miliseconds are the actual arguments to call back function
//deleting the timer
if(ing.includes('spinach'))clearTimeout(pizzaTimer);
//----------------------------------------------------------setInterval----------------------
//callback executed over and over
/*
setInterval(function(){
  const now=new Date();
  const time=`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  console.log(`current time is ${time}`);
},1000)
*/
//--------------Impimenting 10min counting timer--------
const temp=new Date();
const temp_min=(+temp.getMinutes());
const temp_sec=(+temp.getSeconds());
//console.log(temp_min,temp_sec);

