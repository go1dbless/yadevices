const http = require("http")
const PORT = process.env.PORT || 8080
const server = http.createServer()

server.on("request", (req, res) => {

    if (req.url === '/') {
        res.write("Home page")
    }

    res.statusCode = 200
    res.end()
})

server.listen(PORT, err => {
    err ? console.error(err) : console.log(`listening on port ${PORT}`)
})