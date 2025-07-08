<div  align="center">

<img  src="https://user-images.githubusercontent.com/5457539/151701924-cbdf9ff8-3e9b-4e5c-b036-43e1ec0bbbef.png"  height=150></img>

<img  src="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftlqh86jgl25x41gf9eed.png"  height=150></img>

</div>

  

<div  align="center">

<h1>Hematology Analyzer Management - Frontend</h1>

</div>

  
## 1. Introduction

> **Hematology Analyzer System**  is a hematology data analyzing and management system, contributes in promoting and enhancing the automation, precision and visualization in the process of the following the blood testing results  for engineers, patients and administrators

This front-end project is built by:

-    **Next.js**: Hiệu suất cao, hỗ trợ file-based routing, App Router. High performance, support file-based routing and App Router.
-    **Tailwind CSS**: Quick-customized UI, easy Dark-mode configuration and responsiveness.
-    **TypeScript**: High stability, automatically data-checking.
-    **Modular Structure**: Support Microservices-orientation division (auth, patient, test-order).

## 2. Project Structure
The following segment of code shows the structure of the folder `src`which is the main working directory of the entire project.

    ├── app/
    │   ├── (auth)/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   └── page.tsx
    ├── assets/
    ├── components/
    ├── constants/
    ├── features/
    │   ├── auth/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   └── services/
    │   ├── patient/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   └── services/
    │   └── test-order/
    │       ├── components/
    │       ├── pages/
    │       └── services/
    └── hooks/

## 3. Configuration guidance
1. **Clone the project** from this remote directory to local directory/folder:
	```
	git remote add origin https://gitlab.com/healthcare5314327/frontend.git
	```

2. Install **dependencies**:

	```
	cd hematology-analyzer
	npm install
	```
3. **Start** server dev:
	```
	npm run dev
	```
Then, the project will start and UI is expected to render at address: `http://localhost:3000`
  


  

## 4. Contact for contribution

In case you have any questions about the project or even the other aspects related to the project, do not have the feeling of hesitation to contact us through email: nguyenlehoangphuc707@gmail.com. Your sincere feedbacks are always the greatest contributions to our work. 

***Thank you and Best Regards!***

 
---

>  *This README.md will be updated regularly to ensure the latest information about the project.*
