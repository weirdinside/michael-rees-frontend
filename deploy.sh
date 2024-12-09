echo "switching branch to master"
git checkout master

echo "building app..."
npm run build

echo "deploying files to server"
scp -r dist/* ani@167.88.45.75:/sites/michael-rees-frontend/dist
