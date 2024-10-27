const app = require("./app");
const port = process.env.PORT;
const http = require("http");

http.createServer(app);

app.listen(port, () => {
	console.log(`Server Is Running Successfully In Port ${port}`);
});
