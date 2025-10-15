// Generar la imagen
docker build -t my-angular-app .

// Correr la imagen en el puerto 8080 (Hacemos un puente apuntando al puerto 80, que está declarado en el Dockerfile)
docker run -p 8080:80 my-angular-app

// Eliminamos la imagen
docker rmi -f first-setup