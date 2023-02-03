import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

// Function for loading effect
let loadInterval;

function loader(element){
  element.textContent = '';
  loadInterval = setInterval(() =>{
    element.textContent +='.';
    if(element.textContent === '....'){
      element.textContent = '';
    }
  }, 300)
}


// Function for typing line by line
function typeText(element, text){
  let index = 0;
  let interval = setInterval(()=>{
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }

  }, 20)
}


// Funciton for generating uniqueID
function generateUniqueID(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}




//Function for changing icons and background colour..
function chatStripe(isAi, value, uniqueID){
  return (
    `      
      <div class = "wraper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src=${isAi?bot:user}
              alt="${isAi?'bot':'user'}"
            />
          </div>
          <div class="message" id=${uniqueID}>${value}</div>
        </div>
      </div> 
    `
  )
}


// Hanle for submit and enter key
const handleSumit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  //user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  //bot's chatstripe
  const uniqueID = generateUniqueID();

  chatContainer.innerHTML += chatStripe(true," ",uniqueID);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID);
  
  loader(messageDiv);
  


  //fetch data from server
  const response = await fetch('http://localhost:5000', 
  {
    method:'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      prompt: data.get('prompt')
    })

  });

  clearInterval(loadInterval);

  messageDiv.innerHTML = " ";

  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  }else{
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong!!"
    alert(err);
  }






}

form.addEventListener('submit', handleSumit);
form.addEventListener('keyup', (e)=>{
  if(e.keyCode === 13){
    handleSumit(e);
  }
})

