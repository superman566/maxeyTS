import http from 'http';

export type MaxeyServerResponse = http.ServerResponse & {
	status: (code: number) => MaxeyServerResponse;
	json: (data: any) => void;
	sendFile: (path: string, mime: string) => void;
};
