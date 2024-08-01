module.exports = {
	roots: ['<rootDir>/src'],
	testMatch: ['<rootDir>/src/**/*.test.ts'],
	transform: {
		'^.+\.tsx?$': 'ts-jest',
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.json',
		},
	},
};
