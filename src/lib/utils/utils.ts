import { StatusCode } from '../types';
import StatusReasons from '../types/statusReasons';

const statusMap: Record<StatusCode, StatusReasons> = {
	[StatusCode.OK]: StatusReasons.OK,
	[StatusCode.CREATED]: StatusReasons.CREATED,
	[StatusCode.BAD_REQUEST]: StatusReasons.BAD_REQUEST,
	[StatusCode.UNAUTHORIZED]: StatusReasons.UNAUTHORIZED,
	[StatusCode.FORBIDDEN]: StatusReasons.FORBIDDEN,
	[StatusCode.NOT_FOUND]: StatusReasons.NOT_FOUND,
	[StatusCode.INTERNAL_SERVER_ERROR]: StatusReasons.INTERNAL_SERVER_ERROR,
	[StatusCode.BAD_GATEWAY]: StatusReasons.BAD_GATEWAY,
	[StatusCode.SERVICE_UNAVAILABLE]: StatusReasons.SERVICE_UNAVAILABLE,
};

export function getStatusReason(code: StatusCode): string {
	return statusMap[code] ?? 'Unknown Status';
}
