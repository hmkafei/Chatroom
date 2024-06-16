<template>
  <div>
    <input type="text" ref="input">
    <button @click="sendMessage">确认输入</button>
    <div  id="chatroom">
      <div v-for="(message, index) in messages" 
      :class="message[1] ? 'sender-my' : 'sender-you'"
      >
      {{ message[0]}}
      </div>
      <!-- 聊天内容 -->
    </div> 
  </div>
</template>

<script setup>
import { io } from 'socket.io-client';
import { ref, onMounted } from 'vue';

const input = ref(null);
// const chatroom = ref(null);
const messages = ref([])

const socket = io('http://localhost:3000');

onMounted(() => {
  socket.on('enter', function(data) {
    console.log(data);
    messages.value.push(data)
    // const messageDiv = document.createElement('div');
    // messageDiv.innerText = data;
    // chatroom.value.appendChild(messageDiv);
    // chatroom.value.scrollTop = chatroom.value.scrollHeight;
  });

  socket.on('test', function(data) {
    console.log(data);
  });

  socket.on('getmessage', function(test) {
    // const messageDiv = document.createElement('div');
    // messageDiv.innerText=test[0];
    messages.value.push(test)
    console.log(test)
    var sender = test[1]? 'me':'you'
    // if (test[1]) {
    //   messageDiv.classList.add('sender-my');
    // } else {
    //   messageDiv.classList.add('sender-you');
    // }
    // chatroom.value.appendChild(messageDiv);
    // chatroom.value.scrollTop = chatroom.value.scrollHeight;
  });
});

function sendMessage() {
  socket.emit('sendmessage', { message: input.value.value });  
  input.value.value = '';
}
</script>
  
<style scoped>
#chatroom {
  height: 200px;
  width: 500px;
  border: 1px solid black;
  overflow-y: auto;
}

.sender-my {
  text-align: right !important;
}

.sender-you {
  text-align: left !important;
}
</style>
