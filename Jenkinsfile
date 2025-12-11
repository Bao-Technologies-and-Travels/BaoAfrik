/* groovylint-disable CompileStatic, DuplicateStringLiteral, LineLength, NestedBlockDepth */
pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        SSH_KEY_ID = 'baoafrik-key'
        SSH_HOST = 'ashprincepageo@34.51.195.222'
        REPO_URL = 'https://github.com/Bao-Technologies-and-Travels/BaoAfrik.git'
        BRANCH = 'coming-soon'
        APP_DIR = '~/BaoAfrik'
        APP_NAME = 'coming-soon'
        DOMAIN = 'https://baoafrik.com'
        EMAIL = 'pageo.fonsah@baotechnologiesandtravels.com'
        BAOTECHNOLOGIES_DEV_TEAM = 'wendy.tembong@baotechnologiesandtravels.com,esther.eyere@baotechnologiesandtravels.com,toni.ebong@baotechnologiesandtravels.com,glory.tama@baotechnologiesandtravels.com,lionel.ngansop@baotechnologiesandtravels.com,arrey.johnson@baotechnologiesandtravels.com'
        DATABASE_URL = credentials('DATABASE_URL')
        EMAIL_USER = credentials('EMAIL_USER')
        EMAIL_PASS = credentials('EMAIL_PASS')
        EXPORT_EMAIL = credentials('EXPORT_EMAIL')
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

                        # install PostgreSQL client
                        sudo apt install -y postgresql postgresql-client

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

        stage('Setup Environment Variables') {
            steps {
                echo 'Setting up environment variables securely...'
                sshagent([env.SSH_KEY_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        set -e
                        cd ${APP_DIR}

                        # Create .env file for backend with DATABASE_URL
                        cat > backend/.env << EOF
                        # Database Configuration
                        DATABASE_URL=${DATABASE_URL}

                        # Email Configuration
                        EMAIL_USER=${EMAIL_USER}
                        EMAIL_PASS=${EMAIL_PASS}
                        EXPORT_EMAIL=${EXPORT_EMAIL}

                        # Server Configuration
                        PORT=3001
                        NODE_ENV=production

                        # CORS Configuration
                        FRONTEND_URL=${DOMAIN}
                        EOF

                        # Set secure permissions
                        chmod 600 backend/.env
                        echo "Environment variables configured securely."
                    '
                    """
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                echo 'Deploying backend API...'
                sshagent([env.SSH_KEY_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        set -e
                        cd ${APP_DIR}/backend

                        # Install backend dependencies
                        npm install

                        # Stop existing backend if running
                        pm2 delete ${APP_NAME}-backend || true

                        # Start backend with PM2
                        pm2 start src/server.js --name "${APP_NAME}-backend" --watch

                        # Save PM2 configuration
                        pm2 save
                        echo "Backend deployment completed successfully."
                    '
                    """
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo 'Deploying frontend on server...'

                sshagent([env.SSH_KEY_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        set -e

                        cd ${APP_DIR}
                        rm -rf node_modules package-lock.json build

                        npm install

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
                            <p>Bao'Afrik coming soon page deployed. Check it out at <a href="${env.DOMAIN}"></a>.</p>
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
