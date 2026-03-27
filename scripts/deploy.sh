#!/bin/bash
echo "Deploying to VPS..."
git add .
git commit -m "$1"
git push
ssh root@82.165.196.73 "cd /var/www/dumfries-pool-league && git pull && npm run build && pm2 restart dumfries-pool-league"
echo "Deploy complete!"
