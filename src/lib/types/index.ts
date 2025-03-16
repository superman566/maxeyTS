import http from 'http';
import StatusCode from './statusCode';
import StatusReasons from './statusReasons';

type MaxeyServerResponse = http.ServerResponse & {
	status: (code: number) => MaxeyServerResponse;
	json: (data: any) => void;
	sendFile: (path: string, mime: string) => void;
};

export { StatusCode, StatusReasons, MaxeyServerResponse };
