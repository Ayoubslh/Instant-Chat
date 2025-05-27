const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

app.use(cors());
app.use(express.json());

const rooms = {}; 

app.listen(3000, () => {
  console.log(' Server started on port 3000');
});


app.get('/rooms', (req, res) => {
  res.json(Object.keys(rooms).filter(room => rooms[room].length > 0));
});

wss.on('connection', (ws) => {
    let userRoom = null;

    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);

            if (msg.type === 'join') {
                userRoom = msg.room;

                
                if (!rooms[userRoom]) {
                    rooms[userRoom] =[];
                }

                
                if (rooms[userRoom].length < 2) {
                    rooms[userRoom].push(ws);
                    console.log(`👤 User joined room: ${userRoom}`);

            
                    broadcastUsers(userRoom);
                } else {
                    ws.send(JSON.stringify({ type: "message", text: "⚠️ Room is full" }));
                    return;
                }
            } else if (msg.type === 'message' && userRoom && rooms[userRoom]) {
                
                rooms[userRoom].forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: "message", text: msg.text }));
                    }
                });
            }
        } catch (error) {
            console.error(" Error processing message:", error);
        }
    });

    ws.on('close', () => {
        if (userRoom && rooms[userRoom]) {
          
            rooms[userRoom] = rooms[userRoom].filter(client => client !== ws);

            console.log(` User left room: ${userRoom}`);

          
            if (rooms[userRoom].length === 0) {
                delete rooms[userRoom];
            }

        
            broadcastUsers(userRoom);
        }
    });

    function broadcastUsers(room) {
        if (rooms[room]) {
            const users = rooms[room].map((_, index) => `User ${index + 1}`);
            rooms[room].forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "users", users }));
                }
            });
        }
    }
});
