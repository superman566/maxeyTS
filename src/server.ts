import http from 'http';
import MaxeyTS from './lib/maxeyTS';
import { MaxeyServerResponse } from './lib/types';

const PORT = Number(process.env.PORT) || 8000;

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

server.route(
	'get',
	'/favicon.ico',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		res.sendFile('./public/favicon.ico', 'image/x-icon');
	}
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
	'get',
	'/api/user',
	(req: http.IncomingMessage, res: MaxeyServerResponse) => {
		res.status(200).json(USERS);
	}
);

server.listen(PORT, () => {
	console.log(`Server started on port:${PORT}`);
});
