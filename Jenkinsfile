/* groovylint-disable CompileStatic, DuplicateStringLiteral, LineLength, NestedBlockDepth */
pipeline {
    agent any

    environment {
        NODE_ENV = 'staging'
        SSH_KEY_ID = 'baoafrik-key'
        SSH_HOST = 'ubuntu@54.80.42.46'
        FRONTEND_DIR = '~/BaoAfrik/frontend'
        BACKEND_DIR = '~/BaoAfrik/backend'
        APP_NAME_FRONTEND = 'frontend'
        APP_NAME_BACKEND = 'backend'
        REPO_URL = 'https://github.com/Bao-Technologies-and-Travels/BaoAfrik.git'
        BRANCH = 'fonsah-staging'
        DOMAIN = 'staging.baoafrik.com'
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
                        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
                        sudo apt install -y nodejs
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
                        # Install Nginx if not already installed
                        if ! command -v nginx &> /dev/null; then
                            sudo apt install -y nginx
                        fi

                        # Install certbot for SSL if not present
                        if ! command -v certbot &> /dev/null; then
                            sudo apt install -y certbot python3-certbot-nginx
                        fi

                        # Setup PM2
                        pm2 startup systemd

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

                        cd ${FRONTEND_DIR}
                        git fetch origin ${BRANCH}
                        git checkout ${BRANCH}
                        git reset --hard origin/${BRANCH}
                        echo "Repository cloned/updated successfully."
                    '
                    """
                }
            }
        }

        stage('Setup frontend Environment') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws_region', variable: 'REACT_APP_AWS_REGION'),
                    string(credentialsId: 'aws_bucket', variable: 'REACT_APP_S3_BUCKET_NAME'),
                ]) {
                    sshagent([env.SSH_KEY_ID]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                            set -e
                            cd ${FRONTEND_DIR}

                            # Remove existing .env if any
                            rm -f .env

                            # Create .env file with actual secrets
                            cat > .env << EOF
                            REACT_APP_API_URL=https://${DOMAIN}/api
                            REACT_APP_WS_URL=wss://${DOMAIN}
                            REACT_APP_AWS_REGION="${REACT_APP_AWS_REGION}"
                            REACT_APP_S3_BUCKET_NAME="${REACT_APP_S3_BUCKET_NAME}"
                            S3_PROFILE_PREFIX=profile-images
                            S3_ATTACHMENTS_PREFIX=attachments
                            EOF

                            chmod 600 .env
                        '
                        """
                    }
                }
            }
        }

        stage('Setup Backend Environment') {
            steps {
                withCredentials([
                    string(credentialsId: 'db_url', variable: 'DATABASE_URL'),
                    string(credentialsId: 'jwt_secret', variable: 'JWT_SECRET'),
                    string(credentialsId: 'jwt_refresh_secret', variable: 'JWT_REFRESH_SECRET'),
                    string(credentialsId: 'resend_api_key', variable: 'RESEND_API_KEY'),
                    string(credentialsId: 'aws_region', variable: 'AWS_REGION'),
                    string(credentialsId: 'aws_bucket', variable: 'AWS_S3_BUCKET'),
                ]) {
                    sshagent([env.SSH_KEY_ID]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                            set -e
                            cd ${BACKEND_DIR}

                            # Remove existing .env if any
                            rm -f .env

                            # Create .env file with actual secrets
                            cat > .env << EOF
                            NODE_ENV=staging
                            PORT=3001
                            DATABASE_URL="${DATABASE_URL}"
                            JWT_SECRET="${JWT_SECRET}"
                            JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
                            JWT_EXPIRE_TIME=30m
                            JWT_REFRESH_EXPIRE_TIME=7d
                            EMAIL_SERVICE=resend
                            RESEND_API_KEY="${RESEND_API_KEY}"
                            EMAIL_FROM_ADDRESS=noreply@baoafrik.com
                            EMAIL_FROM_NAME="BaoAfrik Team"

                            AWS_REGION="${AWS_REGION}"
                            AWS_S3_BUCKET="${AWS_S3_BUCKET}"
                            S3_PROFILE_PREFIX=profile-images
                            S3_ATTACHMENTS_PREFIX=chat-attachments
                            S3_PRODUCT_PREFIX=product-images

                            APP_ENCRYPTION_KEY="fonsahappencrypt"
                            DB_ENCRYPTION_KEY="fonsahdbencrypt"

                            FRONTEND_URL="https://${DOMAIN}"
                            CORS_ORIGINS="https://${DOMAIN}"
                            BCRYPT_ROUNDS=12
                            RATE_LIMIT_WINDOW_MS=900000
                            RATE_LIMIT_MAX_REQUESTS=100
                            EOF

                            chmod 600 .env
                        '
                        """
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deploying frontend and backend on server...'

                sshagent([env.SSH_KEY_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_HOST} '
                        echo "Starting backend deployment..."

                        cd ${BACKEND_DIR}

                        if [ ! -f .env ]; then
                            echo "ERROR: .env file not found!"
                            exit 1
                        fi

                        rm -rf dist/ node_modules package-lock.json

                        npm install
                        npm run build

                        npx prisma generate
                        npx prisma db push

                        pm2 delete ${APP_NAME_BACKEND} || true
                        pm2 start dist/server.js --name ${APP_NAME_BACKEND} -- --port 3001
                        pm2 save

                        echo "Backend deployed successfully."
                        echo "Starting frontend deployment..."

                        cd ${FRONTEND_DIR}
                        rm -rf node_modules package-lock.json build/

                        npm install
                        export NODE_OPTIONS=--max-old-space-size=4096
                        npm run build

                        pm2 delete ${APP_NAME_FRONTEND} || true
                        pm2 start serve --name ${APP_NAME_FRONTEND} -- -s build -l 3000

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
                        replyTo: 'no-reply@baoafrik.com',
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
                replyTo: 'no-reply@baoafrik.com',
                body: """
                    <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                            <h2 style="color: #2E86C1;">BaoAfrik Staging Notification</h2>
                            <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                            <p><strong>Status:</strong> <span style="color: ${currentBuild.currentResult == 'SUCCESS' ? 'green' : 'red'};">${currentBuild.currentResult}</span></p>
                            <p><strong>Changes made:</strong>My listings page connected to backend, can edit/delete listings</p>
                            <p>Check the <a href="${env.BUILD_URL}"> console output</a> for details and also see recent changes at <a href="${env.DOMAIN}"></a>.</p>
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
