## create node server by scratch

1.npm init -y
2.npm install express body-parser @types/express @types/body-parser typescript ts-node --save-dev
3.create tsconfig.json file
4.install tslib
5.add scripts
6.npm install dotenv @types/dotenv --save-dev
7.npm install --save-dev --save-exact prettier
8.implement a prettier npm install --save-dev husky lint-staged
9.npm install knex pg typescript ts-node @types/node
10.implement a knex
11.implement a morgan
12.implement a swagger && cors && helmet


## make migration
npm run make:migrate

## run migration
npm run run:migrate

## run seeder
npm run run:seed


docker run -d --name some-rabbit -p 5672:5672 -p 5673:5673 -p 15672:15672 rabbitmq:3-management



## docker setup
sudo docker images
grep docker /etc/group
sudo usermod -aG docker $USER
sudo chmod 666 /var/run/docker.sock


## when a conflict error occur
docker rm c9382a583aa7
docker rename c9382a583aa7 root
docker run --name new-container-name image-name

## stop rabbit
docker stop some-rabbit
docker rm some-rabbit
docker rename some-rabbit new-name
