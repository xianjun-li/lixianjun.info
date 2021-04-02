 cd $(cd "$(dirname "$0")";pwd)/contents \
  && git checkout . \
  && git pull --ff-only origin master \
  && yarn build