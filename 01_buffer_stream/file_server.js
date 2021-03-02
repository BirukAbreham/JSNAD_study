const fs = require("fs");
const server = require("http").createServer();

// The code loads the big.file (427 MB) to memory
// to serve on http request
server.on("request", (req, res) => {
  fs.readFile("./big.file", (err, data) => {
    if (err) throw err;

    res.end(data);
  });
});

// The code writes the response, by using stream and
// reads it from the 'big.file'
server.on("request", (req, res) => {
  const src = fs.createReadStream("./big.file");
  src.pipe(res);
});

server.listen(9090);
