import './style.css'
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent = '';
  loadInterval = setInterval(()=>{
  element.textContent += '.';
  if(element.textContent === '....'){
    element.textContent = '';
  }

  },300)
}

function typeText(element, text){
  let index = 0;
  let interval = setInterval(() => {
    if(index < text.length)
    {
      element.innerHTML += text.charAt(index);
      index++;
    }
    else
    {
        clearInterval(interval);
    }
    
  }, 20);
}

function generateUniqueId(){

  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);
  const uniqueId = `id-${timeStamp}-${hexaDecimalString}`;
  console.log('START----generateUniqueId-----');
  console.log(timeStamp);
  console.log(randomNumber);
  console.log(hexaDecimalString);
  console.log(uniqueId);
  console.log('END----generateUniqueId-----');
  return uniqueId;
 

}

function chatStripe(isAi, value, uniqueId){

  return(
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
    )

}

const handleSubmit = async(e)=>{
    e.preventDefault();
    const data = new FormData(form);

    //users chat stripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

    //ai's chat stripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, "", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv =  document.getElementById(uniqueId);
    loader(messageDiv);

    // fetch data from server -> bot response
    //alert(data.get('prompt'));
    const response = await fetch('http://localhost:5557/',{
      method: 'POST',
      headers:{
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: data.get('prompt')
      })

    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok){
      const data = await response.json();
      console.log(data);
      const parsedData = data.bot.trim();
      typeText(messageDiv, parsedData);
    }else{
      const err = await response.text;
      messageDiv.innerHTML = 'Something went wrong!';
      /*alert(err);*/
    }
}




form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }

})
/*
document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`
*/
