<template>
  <div>
    <Chatroom/>
     <!-- <Test></Test> -->
     <RouterView></RouterView>
    </div>

</template>

<script setup>
//  import Test from './components/Test.vue'
import HelloWorld from './components/HelloWorld.vue';
import Chatroom from './components/Chatroom.vue'
 import {ref} from 'vue'
</script>

<style></style>