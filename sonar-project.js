const sonarqubeScanner = require("sonarqube-scanner");

sonarqubeScanner(
  {
    serverUrl: "http://localhost:9000",
    token: "SONAR-TOKEN",
    options: {
      "sonar.sources": "./src",
      "sonar.exclusions": "**/*.test.*",
      "sonar.testExecutionReportPaths": "reports/test-report.xml",
    },
  },
  () => {},
);