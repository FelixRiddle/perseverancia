// This doesn't works, it has to be a function
// export const DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

/**
 * Check if it's development
 */
export function isDevelopment() {
	return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

/**
 * Server port
 */
export function serverPort() {
	return process.env.PORT || (!isDevelopment() && 8084) || 3010;
}
