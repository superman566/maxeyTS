import http from 'http';
import MaxeyTS from './lib/maxeyTS';
import { MaxeyServerResponse } from './lib/types';

const PORT = Number(process.env.PORT) || 8000;

const server = new MaxeyTS();

server.route(
	'get',
	'/',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		res.sendFile('./public/index.html', 'text/html');
	}
);

server.route(
	'get',
	'/styles.css',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		res.sendFile('./public/styles.css', 'text/css');
	}
);

server.route(
	'get',
	'/scripts.js',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		res.sendFile('./public/scripts.js', 'text/javascript');
	}
);

server.listen(PORT, () => {
	console.log(`Server started on port:${PORT}`);
});
