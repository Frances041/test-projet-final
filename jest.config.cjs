/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",               // Dit à Jest d’utiliser ts-jest
  testEnvironment: "node",         // On exécute dans Node.js (pas navigateur)
  testMatch: ["**/tests/**/*.test.ts"], // Où chercher les fichiers de test
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  clearMocks: true,
};