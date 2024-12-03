module.exports = {
    testEnvironment: "node",
    verbose: true,
    setupFiles: ["<rootDir>/jest.setup.js"],
    collectCoverage: true, // Habilitar la recolección de cobertura
    collectCoverageFrom: [
        "src/**/*.{js,jsx}", // Analizar todos los archivos dentro de la carpeta src
        "!src/**/*.test.js", // Excluir archivos de prueba
        "!src/config/**",    // Excluir archivos de configuración
    ],
    coverageDirectory: "coverage", // Carpeta donde se guardará el reporte de cobertura
    coverageReporters: ["text", "lcov"], // Formatos de salida del reporte
};
