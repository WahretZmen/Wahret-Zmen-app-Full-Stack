Wahret-zmen-app-full-stack - How to run this project: For Frontend

Follow the below steps to run the project:

Firstly clone or unzip the project folder.

Go to the frontend directory by using the following command cd frontend. create a .env.local file in the backend root directory as the same level where the package.json is located and keep the following environment variables there:

Stepup firebase app and configure the environment

VITE_API_KEY="AIzaSyAFY3cGsD89V-RMtNKMtDXXLJcaFgbSeLU" VITE_Auth_Domain="wahret-zmen-mern-app.firebaseapp.com" VITE_PROJECT_ID="wahret-zmen-mern-app" VITE_STORAGE_BUCKET="wahret-zmen-mern-app.firebasestorage.app" VITE_MESSAGING_SENDERID="705380265738" VITE_APPID="1:705380265738:web:0125f120cec4db524d54f3"

Then run npm install commend to install node dependencies.

Finally, to run the project, use npm run dev command.

![Capture frontend](https://github.com/user-attachments/assets/64c2587b-f2ea-42c6-bb9b-531037dcfa1f)


For Backend : Follow the below steps to run the project: Firstly clone or unzip the project folder. Go to the backend directory by using the following command cd backend. Then run npm install commend to install node dependencies. create a .env file in the backend root directory as the same level where the package.json is located and keep the following environment variables there:

DB_URL = "mongodb+srv://WahretZmen:oalH5E1B7AvSEiZJ@clusterwahretzmen.mjoo9wj.mongodb.net/Wahret_Zmen_Boutique"

JWT_SECRET_KEY= "aab5f42ccdbe551c24f9ac6b519bb3d09d548701122d1a073e1a1b357d3c049d0951c4d2fb3ec22d362d30f360451bb16ca3d5bb380fb4e41d44a1729f38a4164b"

EMAIL_USER="wahretzmensabri521@gmail.com" EMAIL_PASS="zlez untz eyop actp"

FIREBASE_ADMIN_KEY={"type":"service_account","project_id":"wahret-zmen-mern-app","private_key_id":"d7c5caae606fa3d21e5177fb774a816448eb37c6","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFwa8MbGrdL2Ya\ni1zolzRdEmXvNTNzMwqTkweRIhLH6JIh60KkLA2nydv1c2RyvdwsQ5+Jb3i5AyLb\nFh3t1tKLVzaNjt+FRqnp7tydVsNTZf1YsMMpXWQOhaPuxDwJ+wt8OFBBM5eC3nfi\njUCR1v2Q8fajeNetoPJw9cGTdZznJew/tJEwcCV9R+ZZH0ZZb9RXPbDcWaV5lTXZ\nnEIR+oa/p7I6bmhuCsFc/v2PJ3smdAkUHHiZ/ULbxZc1QEXItoyn3ayfAIoIa/I/\n+uji16FPmRRms/+n5Zv/fT3a6osfM7DKRB2369fEk1VqfCwb9sC5pRUB5AtQseWz\nag1Ig62ZAgMBAAECggEAGYre7L2zfyvS8M/E/tJ03tFJsuq4tq2bipxy3Zc8khnj\nMhgHIgRXToTp8QXoA1KsNa1rAEnnxQx3e+ZwlC/rPuMotoJYiDLXLyd9KEy0wDi2\npIt5kbCwg+2qqGQr6xAZbNXV4S4O6PDfeYwhZb+Skx5QQHoTGtKPLfGYK08wJmy1\n4W+BQ0j5wlNKV3MnO3gCr3/GAllewdpNFwV+/lwRyB/CmFCAAE2ZJDuB7+4iAACa\npBAbeCURC/WAK7cAeGTJTQwFsGOF6P+f9LQH8L+764Vfa8kJffOi90szkpuSqH7A\nS/HMWRFa3YFBIt3FX6rHdvvC/fc4NBYEs1ZFiIiRFwKBgQDmwU8oiKXxvxXMVqcD\n716dPw3F+33yd25xzT/Z1Wtwar5tFMpGqlI1jLmZyQY9dT6eW+BkqjPWDAUm+M+G\n5Art7F+AOlqUkKowTG4x4s8trevEivyHyn7r8bbLb5OgJvp8A2+sMbH4c+yn1frm\nvgq8bLEUR3CRhoxKUabvxz8PRwKBgQDbZDG5E8omf2KQzQ+qEqDIdgq0GZZS/GS5\nkxRvGJAmywNT5KbPFOtyR1ZdrUc7qXArUNErMNaCY5OyAzxs1Sh92TJVILi9m9cp\nKkESxf81GM89tTQqeAnhU5C9ZZqnUxcxwviVtXQ/eJu19W+TpF91pH567WyFE3lP\nbnmdN0qMHwKBgQC4iPr+1Viv3TpXcSybTwABDH29SIPONYiTZaqcT7pd6l9i6G9i\n165quKFsxIBDAdIT3jGzDxHpKS+tnOiJXTEIWDF/YCs0CASyH004g8NfKmkTgnq1\nNVEO6vxd8FrEhqdmKXFS6WMD5+Dnz42YnX4EdX+fUgpJtqnWfTndIx/g3QKBgCfg\nZklFl5C3xqqbGyXGjQLisb9ah0A+L/CrEyO+SzVB4TD2dntdSg5TeRc9z5zAh2rY\nHazEC7lXcBkDDZCajemR+NwQPoP4N3t7+qf25RQ5ljGZJgoyF1mlXsGOHjYbnDOn\nRJexi5edzG+eVNF5JwCzDWo6jWcCyyHs6p3w1tPxAoGBAKq0trHvZnDmCsMo2yWi\nmcT78EBEvdYdqssgpe2Q0ZuNrvHPxDI5FNkGXVEuq40Fu03xdUZb749X3C1Mhy5t\nOC1rPGu+Ig3G/qeMUd7OjR5G/KzwM8kE++Djfj6vmizVKXZfo6bS309dlcuEb+w3\nem5ttYiJ3STmpM7F2oEgR4IQ\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@wahret-zmen-mern-app.iam.gserviceaccount.com","client_id":"103055258517452588569","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40wahret-zmen-mern-app.iam.gserviceaccount.com","universe_domain":"googleapis.com"}

CLOUDINARY_CLOUD_NAME=dcgmcqszn CLOUDINARY_API_KEY=236674418569379 CLOUDINARY_API_SECRET=OVTm_TgFreBJDJRRB95PjJTThr4

To connect with this account Cloudinary please connect with wahretzmensabri521@gmail.com to Cloudinary : https://cloudinary.com/ Finally, to run the project, use npm run start:dev command.

![Capture frontend](https://github.com/user-attachments/assets/43ff0a8a-b6a1-4f8f-8e96-c851f742c4ac)
