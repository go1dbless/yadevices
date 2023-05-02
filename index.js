const http = require("http")
const PORT = process.env.PORT || 8080
const server = http.createServer()
const axios = require('axios');
const fs = require('fs');

axios.defaults.headers.common['Authorization'] = `Bearer y0_AgAAAAAbar_TAAnZZAAAAADiVd0H3Tr-NAznQXqERqvtS2qUNb7GHAQ`;
axios.defaults.headers.common['Content-Type'] = `application/json`;
axios.defaults.baseURL = "https://api.iot.yandex.net/v1.0";


const LAMP_ID = "d83de6ad-8e34-4173-8d6b-dfe736a5af8f";
const SOCKET_ID = "b884d23f-64b9-4449-a803-a8c6a43738d6";

server.on("request", async (req, res) => {

    if (req.url === '/') {
        res.write("Home page")
    }

    if (req.url === '/devices') {
        const response = await axios.get('/user/info');
        fs.writeFile('devices.json', JSON.stringify(response.data), err => {
            if (err) {
                console.log('Error writing file:', err);
            } else {
                console.log('Data saved to file');
            }
        });
    }

    if (req.url === '/socket') {
        const response = await axios.get('/devices/'+SOCKET_ID);
        var newState = !response.data.capabilities.filter((e) => e.type === 'devices.capabilities.on_off')[0].state.value

        await axios.post('/devices/actions', {
            "devices": [
                {
                    "id": SOCKET_ID,
                    "actions": [
                        {
                            "type": "devices.capabilities.on_off",
                            "state": {
                                "instance": "on",
                                "value": newState
                            }
                        }
                    ]
                }
            ]
        }
        );
    }

    if (req.url === '/lamp') {
        const response = await axios.get('/devices/'+LAMP_ID);
        var newState = !response.data.capabilities.filter((e) => e.type === 'devices.capabilities.on_off')[0].state.value

        await axios.post('/devices/actions', {
            "devices": [
                {
                    "id": LAMP_ID,
                    "actions": [
                        {
                            "type": "devices.capabilities.on_off",
                            "state": {
                                "instance": "on",
                                "value": newState
                            }
                        }
                    ]
                }
            ]
        }
        );
    }

    res.statusCode = 200
    res.end()
})

server.listen(PORT, err => {
    err ? console.error(err) : console.log(`listening on port ${PORT}`)
})