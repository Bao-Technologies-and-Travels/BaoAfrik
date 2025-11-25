/* groovylint-disable CompileStatic, DuplicateStringLiteral, LineLength, NestedBlockDepth */
pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        SSH_KEY_ID = 'baoafrik-key'
        SSH_HOST = 'ubuntu@3.81.142.143'
        REPO_URL = 'https://github.com/Bao-Technologies-and-Travels/BaoAfrik.git'
        BRANCH = 'coming-soon'
        APP_DIR = '~/BaoAfrik'
        APP_NAME = 'coming-soon'
        DOMAIN = 'https://baoafrik.com'
        EMAIL = 'pageo.fonsah@baotechnologiesandtravels.com'
        BAOTECHNOLOGIES_DEV_TEAM = 'wendy.tembong@baotechnologiesandtravels.com,esther.eyere@baotechnologiesandtravels.com,toni.ebong@baotechnologiesandtravels.com,glory.tama@baotechnologiesandtravels.com,lionel.ngansop@baotechnologiesandtravels.com,arrey.johnson@baotechnologiesandtravels.com'
    }

    stages {
        stage('Setup server dependencies') {
            steps {
                echo 'Setting up server dependencies...'

                sshagent([env.SSH_KEY_ID]) {
                    // step 1: system updates
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                    set -e
                        # Update and upgrade server packages
                        sudo apt update && sudo apt upgrade -y
                    '
                    """

                    // step 2: install Nodejs
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        # Install Node.js and npm if not already installed
                        curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
                        sudo apt install -y nodejs

                        # Verify Node.js installation
                        echo "Node.js version:"
                        node --version
                        echo "npm version:"
                        npm --version
                    '
                    """

                    // step 3: install pm2
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        # Install PM2 globally
                        sudo npm install -g pm2@latest
                        pm2 --version
                    '
                    """

                    // step 4: install other dependencies
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        # Setup PM2
                        pm2 startup systemd

                        # Install serve globally
                        sudo npm install -g serve

                        echo "System dependencies installed successfully."
                    '
                    """
                }
            }
        }

        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                sshagent([env.SSH_KEY_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        set -e
                        if [ ! -d ~/BaoAfrik ]; then
                            git clone -b ${BRANCH} ${REPO_URL} ~/BaoAfrik
                        fi

                        cd ${APP_DIR}
                        git fetch origin ${BRANCH}
                        git checkout ${BRANCH}
                        git reset --hard origin/${BRANCH}
                        echo "Repository cloned/updated successfully."
                    '
                    """
                }
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deploying frontend and backend on server...'

                sshagent([env.SSH_KEY_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        set -e

                        cd ${APP_DIR}
                        rm -rf node_modules package-lock.json build

                        npm install

                        if ! npm list react-scripts | grep react-scripts > /dev/null 2>&1; then
                            echo "Installing react-scripts..."
                            npm install --save-dev react-scripts
                        fi

                        npm run build

                        pm2 delete ${APP_NAME} || true
                        pm2 start serve --name ${APP_NAME} -- -s build -l 3000

                        pm2 save
                        pm2 list

                        echo "Frontend deployment completed successfully."
                    '
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                emailext(
                        subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
                        to: "${env.EMAIL}",
                        from: 'jenkins.baoafrik.com',
                        replyTo: 'no-reply@baotechnologiesandtravels.com',
                        body: """
                            <html>
                                <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                                    <h2 style="color: #2E86C1;">Jenkins Build Notification</h2>
                                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                                    <p><strong>Status:</strong> <span style="color: ${currentBuild.currentResult == 'SUCCESS' ? 'green' : 'red'};">${currentBuild.currentResult}</span></p>
                                    <p>Check the <a href="${env.BUILD_URL}">console output</a> for details.</p>
                                    <hr>
                                    <p style="font-size: 0.9em; color: #565;">This is an automated email from Jenkins. Please do not reply.</p>
                                </body>
                            </html>
                        """,
                        mimeType: 'text/html'
                    )
            }
        }
        success {
            script {
                emailext(
                subject: "${env.JOB_NAME} - ${currentBuild.currentResult}",
                to: "${env.BAOTECHNOLOGIES_DEV_TEAM}",
                from: 'jenkins.baoafrik.com',
                replyTo: 'no-reply@baotechnologiesandtravels.com',
                body: """
                    <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                            <h2 style="color: #2E86C1;">BaoAfrik Production Notification</h2>
                            <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                            <p><strong>Status:</strong> <span style="color: ${currentBuild.currentResult == 'SUCCESS' ? 'green' : 'red'};">${currentBuild.currentResult}</span></p>
                            <p>Bao'Afrik coming soon page deployed. Check it out at <a href="${DOMAIN}"></a>.</p>
                            <hr>
                            <p style="font-size: 0.9em; color: #565;">This is an automated email from Jenkins. Please do not reply.</p>
                        </body>
                    </html>
                """,
                mimeType: 'text/html'
                )
            }
        }
    }
}
