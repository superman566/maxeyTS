enum StatusReasons {
	OK = 'OK',
	CREATED = 'Created',
	BAD_REQUEST = 'Bad Request',
	UNAUTHORIZED = 'Unauthorized',
	FORBIDDEN = 'Forbidden',
	NOT_FOUND = 'Not Found',
	INTERNAL_SERVER_ERROR = 'Internal Server Error',
	BAD_GATEWAY = 'Bad Gateway',
	SERVICE_UNAVAILABLE = 'Service Unavailable',
}

export default StatusReasons;
