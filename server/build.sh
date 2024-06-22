# 删除dist
rm -r dist

# 构建
npm run build
cp .env.production dist/.env
cp package.json dist/package.json
cp package-lock.json dist/package-lock.json
cd dist 
# 编译
npm i --production -f

# client 打包
cd ../../
npm run build
# 打包静态资源
cp -r ./web  ./server/dist/

# 打包
cd ./server/dist
tar -cvzf ProjectTaskServer.tar.gz ./* ./.env
mv ProjectTaskServer.tar.gz ../