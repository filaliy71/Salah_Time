pipeline {
    agent any
    
    stages {
        stage('SonarQube analysis') {
            steps {
                script {
                    withSonarQubeEnv('sonar') {
                        def scannerHome = tool 'sonar'
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }
}
