# After cloning this project
npm install  

# Setting up this Next-App
npm run dev 


# setting up googleOauth
Open your GoogleConsole create , create your own project ; generate clientID and private key and add it in .env File

# setting up Mongo-DB
Create a Project in MongoDb.com 
Create a Cluster and add the MongoDb-Uri String in .env File

# FileStorage Setup
Create a S3 bucket storage in AWS
Create The user add it to the group and give the necessary policies and generate the PrivateKey , BucketName, and also region 
Add it in .env File


# Add NextAuthURI for Local Testing as well change this after deployment

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000
NEXTAUTH_SECRET=