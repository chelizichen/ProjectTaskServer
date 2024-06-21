# 删除dist
rm -r dist

# 构建
npm run build
cp .env dist/.env
cp package.json dist/package.json
cd dist 
# 编译
npm i --production -f

cd ../../
# client 打包
npm run build
# 打包静态资源
mv -r web  ./server/dist/web

# 打包
cd ./server
tar -cvf ProjectTaskServer.tar.gz ./dist