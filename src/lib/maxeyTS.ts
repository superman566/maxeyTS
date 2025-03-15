import http from "http";

export default class MaxeyTS {
	#server: http.Server;
	#routes: Map<string, Function>; // key is unlimited, will adopt Map

	constructor() {
		this.#server = http.createServer();
		this.#routes = new Map();

		this.#server.on("request", (req, res) => {
			const method = req.method?.toLowerCase() ?? "get";
			const url = req.url ?? "/";
			const key = method + url;
			const route = this.#routes.get(key);
			console.log("A request comes in!");
			console.log("routes:", ...this.#routes.keys());

			// set status code of the response
			// res.status = (code: number) =>{
			// 	res.statusCode = code;
			// 	return res;
			// }

			// res.json = () =>{}

			if (!route) {
				res.writeHead(404, { "Content-Type": "text/plain" });
				res.end("Not Found");
			} else {
				route(req, res);
				res.writeHead(200, { "Content-Type": "text/plain" });
				res.end("ok");
			}
		});
	}

	route(method: string, path: string, callback: Function) {
		const key = method.toLowerCase() + path;
		this.#routes.set(key, callback);
	}

	listen(port: number, callback: () => void) {
		this.#server.listen(port, callback);
	}
}
