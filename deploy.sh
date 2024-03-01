#!/bin/bash

## Make sure to install node and nginx on the EC2 instance
npm run build

# Copy all files to the EC2 instance excluding .venv folder
rsync -avz --exclude "node_modules" --exclude ".idea" --exclude ".git" --exclude ".env" -e "ssh -i $1" . ec2-user@$2:/home/ec2-user/app

# Connect to AWS EC2 instance using SSH key
ssh -i $1 ec2-user@$2<< EOF

export BIGCOMMERCE_STORE_HASH=$3
export BIGCOMMERCE_ACCESS_TOKEN=$4
cd /home/ec2-user/app

sudo rm -r /app/react/build
sudo mv -u build /app/react/
sudo mv express.js /app/server/express.js

# Start express
sudo mv server/package.json /app/server/
sudo mv server/pm2.config.js /app/server/
cd /app/server/ && \
    sudo npm install && \
    pm2 startOrReload pm2.config.js --env production

# Configure nginx
sudo mv /home/ec2-user/app/candystore.conf /etc/nginx/conf.d/
sudo nginx -t
sudo nginx -s reload
sudo systemctl restart nginx
EOF