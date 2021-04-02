#!/bin/sh
echo "start" >> /www/log/start.log && atp && node ./webhook.js