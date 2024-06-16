const express = require('express');  
const http = require('http');  
const { Server } = require('socket.io'); 
const ethers = require('ethers')
const path = require('path');
const cors = require('cors')

const app = express();  
const server = http.createServer(app);  
const io  = new Server(server,{
  cors:{
      origin:'http://localhost:5173',
      methods:["GET","POST"]
  }
});

app.use(cors())
app.use(express.static('public'));  

app.get('/', (req, res) => {  
  res.sendFile(path.join(__dirname, '..','vue-chatroom', 'index.html'));  
});

const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545'); 

const signer = provider.getSigner();
const contractAddress = '0xfb162e727b445c178b928b56db3ccb8cbfbf0140';

const contractABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "messages",
        "outputs": [
            {
                "name": "syin",
                "type": "uint256"
            },
            {
                "name": "sender",
                "type": "address"
            },
            {
                "name": "content",
                "type": "string"
            },
            {
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_content",
                "type": "string"
            }
        ],
        "name": "sendMessage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_syin",
                "type": "uint256"
            }
        ],
        "name": "getMessage",
        "outputs": [
            {
                "components": [
                    {
                        "name": "syin",
                        "type": "uint256"
                    },
                    {
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_account",
                "type": "address"
            },
            {
                "name": "_id",
                "type": "uint256"
            },
            {
                "name": "_age",
                "type": "uint256"
            },
            {
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "addperson",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getperson",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_account",
                "type": "address"
            },
            {
                "name": "_id",
                "type": "uint256"
            },
            {
                "name": "_age",
                "type": "uint256"
            },
            {
                "name": "_name",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "content",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "NewMessage",
        "type": "event"
    }
]
const contract = new ethers.Contract(contractAddress, contractABI,signer);	

server.listen(3000,()=>{
    console.log('启动成功')
})

// var io = require('socket.io')(app)
let count = 1

io.on('connection',function(socket){
    console.log(`新用户${count}连接成功`)
    io.emit('enter',[`用户${count}加入成功`,false]);
    count++
    socket.on('my other event',function (data){
        sendMessage(contract,data)
        getMessage(contract,'0')
    });
    socket.on('sendmessage',function(data){                           //获取前端用户输入的数据
        console.log('本次传递的信息是:',data)
        sendMessage(contract, data.message)
        // allproduce(message)
        let senderId = 1
        // let messages = [data.message, true];
        socket.emit('getmessage',[data.message, true]);
        socket.broadcast.emit('getmessage',[data.message, false])
        senderId++
        // io.emit('test','我很愤怒')        
    })
    

})


// function allproduce(message){
//     io.emit('gettmessage',message)
// }
async function sendMessage(contract, infomation) {  
    try {  
      const transaction = await contract.sendMessage(infomation);  
    //   console.log('信息添加成功:', infomation);  
  
      // 等待交易被挖出并确认  
      const receipt = await transaction.wait(1); // 等待一个确认  
      console.log('信息添加成功:', infomation);  
    } catch (error) {  
      console.error('Error setting value:', error);  
    }  
  }


  async function getMessage(contract,syin){
    try{
        const transaction = await contract.getMessage(syin);
        console.log(transaction.syin.toString(),transaction.content.toString(),transaction.timestamp.toString())
    }catch (error){
        console.error(error)
    }
}