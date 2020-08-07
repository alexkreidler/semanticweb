module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testPathIgnorePatterns: ["<rootDir>/dist/"],
    setupFilesAfterEnv: ["jest-extended"],
}
