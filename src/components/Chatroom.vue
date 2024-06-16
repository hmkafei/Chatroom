<template>
  <el-container style="height: 100vh;">
    <el-aside width="300px" style="height: 100%; background: #f2f2f2;">
      成员列表<br>
      <div v-for="user in users" :key="user">{{ user }}</div>
      <!-- 成员列表头像 -->
    </el-aside>
    <el-container>
      <el-main style="height: 100%; background: #ffffff;">
        <div ref="chatroom" id="chatroom">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="message[1] ? 'sender-my' : 'sender-you'"
          >
            {{ message[0] }}
          </div>
        </div>
        <el-button class="icons" >
          <span class="el-dropdown-link">
            聊天设置&emsp;
        <el-icon :style="{ fontSize: '24px' }"><Setting /></el-icon>&emsp;
          </span>
      </el-button>

      <el-button class="icons" @click="subRefresh">
        <span class="el-dropdown-link">
          页面刷新&emsp;
        <el-icon :style="{ fontSize: '24px' }"><Refresh /></el-icon>
          </span>
      </el-button>
      </el-main>
      <el-aside>
        <el-input
          @keydown.enter="sendMessage"
          class="input"
          v-model="inputValue"
          type="text"
          ref="input"
        />
        <el-button class="send" type="primary" @click="sendMessage">
          确认输入
        </el-button>
        <br />
        <el-button class="icons" @click="getdelete">
          <span class="el-dropdown-link">
            清除器&emsp;
            <el-icon :style="{ fontSize: '24px' }"><Delete /></el-icon>
          </span>
        </el-button>
        
        <el-button class="icons">
          <el-dropdown>
            <span class="el-dropdown-link">
              常用语&emsp;
              <el-icon :style="{ fontSize: '24px' }"><ChatSquare /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="usually('你们好呀')">
                  你们好呀
                </el-dropdown-item>
                <el-dropdown-item @click="usually('今天吃了吗')">
                  今天吃了吗
                </el-dropdown-item>
                <el-dropdown-item @click="usually('没事没事')">
                  没事没事
                </el-dropdown-item>
                <el-dropdown-item disabled>
                  111,apex二等一
                </el-dropdown-item>
                <el-dropdown-item divided @click="usually('抱歉抱歉')">
                  抱歉抱歉
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-button>
        <el-button class="icons">
          <span class="el-dropdown-link">
            用户设置
            <el-icon :style="{ fontSize: '24px' }"><User /></el-icon>
          </span>
        </el-button>
        
        <el-button class="icons">
          <span class="el-dropdown-link">
            用户退出
            <el-icon :style="{ fontSize: '24px' }"><Edit /></el-icon>
          </span>
        </el-button>
      </el-aside>
    </el-container>
  </el-container>

</template>

<script setup>
import {
  Setting,
  Delete,
  Refresh,
  ChatSquare,
  User,
  Edit,
} from '@element-plus/icons-vue'
import {RouterView} from 'vue-router'
import { ref, onMounted, watch, nextTick } from 'vue'
import { io } from 'socket.io-client'
import { ElMessage } from 'element-plus'

const inputValue = ref('')
const input = ref(null)
const chatroom = ref(null)
const messages = ref([])
const users = ref([])

const socket = io('http://localhost:3000')

onMounted(() => {
  socket.on('enter', function (data) {
    if (typeof data[0] === 'string' && data[0].includes('加入成功')) {
      let user = data[0].split('加入成功')[0]
      users.value.push(user)
      ElMessage({
        message: '新用户加入: ' + user,
        type: 'success',
        duration: 3000, // 3 秒后自动消失
      })
    }
    messages.value.push(data)
  })

  socket.on('test', function (data) {
    // 处理 test 事件
  })

  socket.on('getmessage', function (test) {
    messages.value.push(test)
  })
})

watch(
  messages,
  () => {
    console.log('messages changed')
    nextTick(() => {
      if (chatroom.value) {
        chatroom.value.scrollTop = chatroom.value.scrollHeight
      }
    })
  },
  { deep: true }
)

function sendMessage() {
  if (inputValue.value.trim() !== '') {
    socket.emit('sendmessage', { message: inputValue.value })
    inputValue.value = ''
  } else {
    console.error('Message is empty')
    ElMessage({
      message: '您输入的消息不符合规定',
      type: 'error',
      duration: 3000, // 3 秒后自动消失
    })
  }
}

// 小功能按钮
function getdelete() {
  inputValue.value = ''
}

function subRefresh(){
  setTimeout(function() {
  location.reload(); // 刷新当前页面
}, 200); // 200毫秒（即0.2秒）
}

function usually(text) {
  inputValue.value = text
  socket.emit('sendmessage', { message: text })
  ElMessage({
    message: '常用语已发送: ' + text,
    type: 'info',
    duration: 3000, // 3 秒后自动消失
  })
}
</script>

<style scoped>
#chatroom {
  height: 400px;
  width: 500px;
  border: 1px solid rgb(84, 82, 82);
  border-radius: 10px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.sender-my {
  text-align: right !important;
}

.sender-you {
  text-align: left !important;
}

.send {
  margin: 10px 0px;
}

.input {
  margin-top: 20px;
}

.icons {
  margin: 10px;
}
</style>
