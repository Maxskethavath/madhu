function sendMessage() {
    var messageInput = document.getElementById('message-input');
    var imageInput = document.getElementById('image-input');
    var message = messageInput.value;
    var image = imageInput.files[0];
  
    if (message.trim() === '' && !image) {
      alert('Please enter a message or select an image');
      return;
    }
  
    var timestamp = getCurrentTimestamp();
  
    if (image) {
      var imageUrl = URL.createObjectURL(image);
      appendImage('my-chat-box', imageUrl, timestamp);
    }
  
    if (message.trim() !== '') {
      appendMessage('my-chat-box', 'You: ' + message, timestamp, 'my-message');
      // Send the message to the backend and get the friend's response
      sendToBackend(message);
    }
  
    // Clear the input fields after sending the message
    messageInput.value = '';
    imageInput.value = '';
  }
  
  function appendMessage(chatBoxId, message, timestamp, className) {
    var chatBox = document.getElementById(chatBoxId);
    var newMessage = document.createElement('p');
    newMessage.className = 'message ' + className;
    newMessage.textContent = message;
    if (timestamp) {
      var timestampElement = document.createElement('span');
      timestampElement.className = 'timestamp';
      timestampElement.textContent = timestamp;
      newMessage.appendChild(timestampElement);
    }
    chatBox.appendChild(newMessage);
  }
  
  function appendImage(chatBoxId, imageUrl, timestamp) {
    var chatBox = document.getElementById(chatBoxId);
    var newImage = document.createElement('img');
    newImage.className = 'chat-image';
    newImage.src = imageUrl;
  
    var imageContainer = document.createElement('div');
    imageContainer.appendChild(newImage);
  
    if (timestamp) {
      var timestampElement = document.createElement('span');
      timestampElement.className = 'timestamp';
      timestampElement.textContent = timestamp;
      imageContainer.appendChild(timestampElement);
    }
  
    chatBox.appendChild(imageContainer);
  }
  
  function getCurrentTimestamp() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    return `${hours}:${minutes}`;
  }
  
  function sendToBackend(message) {
    fetch('http://localhost:3000/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    })
    .then(response => response.json())
    .then(data => {
      setTimeout(() => {
        appendMessage('friend-chat-box', data.message, getCurrentTimestamp(), 'friend-message');
      }, 1000);
    })
    .catch(error => console.error('Error:', error));
  }
  