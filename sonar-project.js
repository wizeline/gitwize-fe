const sonarqubeScanner = require("sonarqube-scanner");

sonarqubeScanner(
  {
    serverUrl: "http://localhost:9000",
    token: "171e3fccb91df88f5dba303f96424d4ca0457e61",
    options: {
      "sonar.sources": "./src",
      "sonar.exclusions": "**/*.test.*",
      "sonar.testExecutionReportPaths": "reports/test-report.xml",
    },
  },
  () => {},
);