import http from 'http';
import { MaxeyServerResponse } from './types';
import fs from 'fs/promises';

export default class MaxeyTS {
	#server: http.Server;
	#routes: Map<string, Function>; // key is unlimited, will adopt Map

	constructor() {
		this.#server = http.createServer();
		this.#routes = new Map();

		this.#server.on(
			'request',
			(req: http.IncomingMessage, res: MaxeyServerResponse) => {
				// set status code of the response
				res.status = function (code: number) {
					res.statusCode = code;
					return res;
				};

				// set a json data back to the client
				res.json = function (data: any) {
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(data));
				};

				res.sendFile = async function (path: string, mime: string) {
					try {
						const fileHandler = await fs.open(path, 'r');
						const fileStream = fileHandler.createReadStream();
						res.setHeader('Content-Type', mime);
						fileStream.pipe(res);

						fileStream.on('end', () => {
							res.status(200).json('Done');
						});

						fileStream.on('error', () => {
							res.status(500).json({
								error: `Internal Server Error`,
							});
						});
					} catch (error) {
						res.status(404).json({ error: 'File not found or cannot be read' });
					}
				};

				const method = req.method?.toLowerCase() ?? 'get';
				const url = req.url ?? '/';
				const key = method + url;
				const routeCallBack = this.#routes.get(key);

				if (!routeCallBack) {
					return res.status(404).json({
						error: `Cannot ${method} ${url}`,
					});
				}
				routeCallBack(req, res);
			}
		);
	}

	route(method: string, path: string, callback: Function) {
		const key = method.toLowerCase() + path;
		this.#routes.set(key, callback);
	}

	listen(port: number, callback: () => void) {
		this.#server.listen(port, callback);
	}
}
