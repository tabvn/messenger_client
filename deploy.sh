rm -rf /Users/toan/Projects/staged-launch-of-ar/sites/all/modules/messenger/*
cp -r /Users/toan/Sites/drupal7/sites/all/modules/messenger/* /Users/toan/Projects/staged-launch-of-ar/sites/all/modules/messenger/;
cd /Users/toan/Projects/staged-launch-of-ar;
git pull;
git add -A;
git commit -m "update messenger";
git push;