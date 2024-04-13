  export default async () => {
    return {
     testEnvironment: 'node',
     transform: {      "^.+\\.[t|j]sx?$": "babel-jest"
    },
      testMatch: [
        "**/tests/unit/**/*.test.js",
      ],
      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
      }
    };
  };