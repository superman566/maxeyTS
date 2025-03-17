import http from 'http';
import { MaxeyServerResponse, StatusCode } from './types';
import fs from 'fs/promises';
import { getStatusReason } from './utils/utils';

export default class MaxeyTS {
	#server: http.Server;
	#routes: Map<string, Function>; // key is unlimited, will adopt Map
	#middlewares: Function[];

	constructor() {
		this.#server = http.createServer();
		this.#routes = new Map();
		this.#middlewares = [];

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

				function runMiddleware(
					req: http.IncomingMessage,
					res: MaxeyServerResponse,
					middlewares: Function[],
					start: number
				) {
					if (middlewares.length === start) {
						if (routeCallBack) {
							// run routes
							routeCallBack(req, res);
						}
					} else {
						middlewares[start](req, res, () => {
							runMiddleware(req, res, middlewares, start + 1);
						});
					}
				}

				res.sendFile = async function (path: string, mime: string) {
					try {
						res.setHeader('Content-Type', mime);

						const fileHandler = await fs.open(path, 'r');
						const fileStream = fileHandler.createReadStream();
						fileStream.pipe(res);

						fileStream.on('end', async () => {
							await fileHandler.close();
							res.end();
						});

						fileStream.on('error', () => {
							res
								.status(StatusCode.INTERNAL_SERVER_ERROR)
								.json(getStatusReason(StatusCode.INTERNAL_SERVER_ERROR));
						});
					} catch (error) {
						res
							.status(StatusCode.BAD_REQUEST)
							.json({ error: 'File not found or cannot be read' });
					}
				};

				const method = req.method?.toLowerCase() ?? 'get';
				const url = req.url ?? '/';
				const key = method + url;
				const routeCallBack = this.#routes.get(key);

				if (!routeCallBack) {
					return res
						.status(StatusCode.BAD_REQUEST)
						.json(getStatusReason(StatusCode.BAD_REQUEST));
				}

				// middleware
				runMiddleware(req, res, this.#middlewares, 0);
			}
		);
	}

	use(callback: Function) {
		this.#middlewares.push(callback);
	}

	route(method: string, path: string, callback: Function) {
		const key = method.toLowerCase() + path;
		this.#routes.set(key, callback);
	}

	listen(port: number, callback: () => void) {
		this.#server.listen(port, callback);
	}
}
