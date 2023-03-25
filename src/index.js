// handle when the user submits a question through the form


global.messages = [
  {
    role: "system",
    content:
      "You are a helpful, empathetic, and friendly customer support specialist. You are here to help customers with their orders. You sometimes make small talk.",
  },
  {
    role: "system",
    content:
      "Additionally, you never ask the customer to upload or provide any photos as our website has no means of doing so at this time. Also, do not mention that you are a bot.",
  },
];

async function handleSubmitMessage(message) {
  // input validation

const userMessage = { role: "user", content: message };

   global.messages.push(userMessage);


    addUserMessageToDialogueBox(message);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },

    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: global.messages,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 200,
      n: 1,
    }),
  });
  if (!response.ok) {
    // if the request was not successful, parse the error

    // return an error response to the client
    return "error";
  }

  const data = await response.json();

  // get the bot's answer from the OpenAI API response
  const res = data.choices[0].message.content;
 
  return res;
}


// add the user's question to the dialogue box
function addUserMessageToDialogueBox(message) {
    // create a new li element
    const userMessage = document.createElement('li');

    // add user-specific styling to element
    userMessage.classList.add('bg-indigo-500', 'text-white', 'rounded', 'p-2', 'w-fit', 'self-end', 'break-words');

    // add the user's message to the element
    userMessage.innerText = message;

    // add the li element to the DOM
    document.getElementById('dialogue').appendChild(userMessage);

    // clear the input for the next question
    document.getElementById('prompt-input').value = '';

    // display loading indicator in dialogue box
    addLoadingIndicatorToDialogueBox();
}

// add the loading indicator to the dialogue box
function addLoadingIndicatorToDialogueBox() {
    // create a new li element
    const loadingIndicator = document.createElement('li');

    // set the id of the loading indicator
    loadingIndicator.id = 'loading-indicator';

    // add loading indicator styling
    loadingIndicator.classList.add('bg-gray-500', 'text-white', 'rounded', 'p-2', 'w-fit', 'self-start', 'w-12');

    // create a new image element
    const loadingImage = document.createElement('img');

    // set the image source
    loadingImage.src = './images/loading.svg';

    // add loading indicator image as a child to li element
    loadingIndicator.appendChild(loadingImage);

    // add the li element to the DOM
    document.getElementById('dialogue').appendChild(loadingIndicator);
}

// remove the loading indicator from the dialogue box
function removeLoadingIndicatorFromDialogueBox() {
    // get the loading indicator element
    const loadingIndicator = document.getElementById('loading-indicator');

    // remove the loading indicator from the DOM
    loadingIndicator.remove();
}

// add the chatbot's response to the dialogue box
function addBotMessageToDialogueBox(response) {
    // remove the loading indicator now that the response has been received
    removeLoadingIndicatorFromDialogueBox();

    // create a new li element
    const botMessage = document.createElement('li');

    // style the bot response element based on the status
    if (response === "error") {
        // add error styling
        botMessage.classList.add('bg-red-500', 'text-white', 'rounded', 'p-2', 'w-fit', 'self-start');

        // add error text
        botMessage.innerText = "Oh no! Something went wrong. Please try again later.";
    } else {
        // add user-specific styling to element
        botMessage.classList.add('bg-gray-500', 'text-white', 'rounded', 'p-2', 'w-fit', 'self-start');

        // add the user's response to the element
        botMessage.innerText = response.trim();
    }

    // add the li element to the DOM
    document.getElementById('dialogue').appendChild(botMessage);

    // clear the input for the next response
    document.getElementById('prompt-input').value = '';
}

// when the window loads, add an event listener to the form
// that calls the handleSubmitMessage function when the form is submitted
window.onload = () => document.getElementById('prompt-form').addEventListener('submit', (e) => {
    // prevent the form from refreshing the page
    e.preventDefault();

    // get the value of the input
    const message = document.getElementById('prompt-input').value;

    // call the function that handles the fetch request to our backend
    handleSubmitMessage(message).then((data) => {
        // add the chatbot's response to the DOM when the fetch request is complete
        addBotMessageToDialogueBox(data);
    });
});
