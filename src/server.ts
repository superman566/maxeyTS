import http from 'http';
import MaxeyTS from './lib/maxeyTS';
import { MaxeyServerResponse, StatusCode } from './lib/types';
import { getStatusReason } from './lib/utils/utils';

const PORT = Number(process.env.PORT) || 8000;

type Session = {
	userId: number;
	token: string;
};

let SESSIONS: Session[] = [];

const USERS = [
	{ id: 1, name: 'tony', username: 'superman566', password: 'password' },
	{ id: 2, name: 'christy', username: 'yaling', password: 'password' },
];

type Post = {
	id: number;
	title: string;
	body: string;
	userId: number;
	auther?: string;
};

const POSTS: Post[] = [
	{
		id: 1,
		title: 'this is a post title',
		body: 'this is a post body',
		userId: 1,
	},
];

type User = {
	username: string;
	password: string;
};

const server = new MaxeyTS();

server.use(
	(req: http.IncomingMessage, res: MaxeyServerResponse, next: Function) => {
		console.log('1st middleware');
		next();
	}
);

server.use(
	(req: http.IncomingMessage, res: MaxeyServerResponse, next: Function) => {
		console.log('2nd middleware');
		next();
	}
);

server.route(
	'get',
	'/',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		res.sendFile('./public/index.html', 'text/html');
	}
);

server.route(
	'get',
	'/login',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		res.sendFile('./public/index.html', 'text/html');
	}
);

server.route(
	'get',
	'/profile',
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

server.route(
	'get',
	'/favicon.ico',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		res.sendFile('./public/favicon.ico', 'image/x-icon');
	}
);

// JOSN Routes
server.route(
	'post',
	'/api/login',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		let body = '';
		let parsedBody: User;
		req.on('data', (trunk) => {
			body += trunk.toString('utf-8');
		});
		req.on('end', () => {
			parsedBody = JSON.parse(body);
			const { username, password } = parsedBody;

			const user = USERS.find(
				(user) => user.username === username && user.password === password
			);

			if (user) {
				const token = Math.floor(Math.random() * 100000000).toString();
				SESSIONS.push({
					userId: user.id,
					token,
				});
				console.log('find user SESSIONS->', SESSIONS);
				res.setHeader('set-Cookie', `token=${token}; Path=/;`);
				res.status(StatusCode.OK).json(getStatusReason(StatusCode.OK));
			} else {
				res
					.status(StatusCode.UNAUTHORIZED)
					.json(getStatusReason(StatusCode.UNAUTHORIZED));
			}
		});
	}
);

server.route(
	'delete',
	'/api/logout',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {}
);

server.route(
	'get',
	'/api/user',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		const token = req.headers.cookie?.split('=')[1];
		console.log('token->', token);
		console.log('SESSIONS->', SESSIONS);
		const session = SESSIONS.find(
			(session: Session) => session.token === token
		);
		if (session) {
			const user = USERS.find((user) => session.userId === user.id);
			if (!user) {
				res
					.status(StatusCode.INTERNAL_SERVER_ERROR)
					.json(getStatusReason(StatusCode.INTERNAL_SERVER_ERROR));
			} else {
				res.status(StatusCode.OK).json({
					username: user.username,
					name: user.name,
				});
			}
		} else {
			res
				.status(StatusCode.UNAUTHORIZED)
				.json(getStatusReason(StatusCode.UNAUTHORIZED));
		}
	}
);

server.route(
	'put',
	'/api/user',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {}
);

server.route(
	'get',
	'/api/posts',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		const usersMap = new Map<number, string>();
		USERS.forEach((user) => {
			usersMap.set(user.id, user.name);
		});

		const posts = POSTS.map((post) => {
			post.auther = usersMap.get(post.userId);
			return post;
		});
		res.status(200).json(posts);
	}
);

server.route(
	'post',
	'/api/posts',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {}
);

server.listen(PORT, () => {
	console.log(`Server started on port:${PORT}`);
});
