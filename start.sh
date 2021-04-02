#!/bin/sh
echo "start" >> /www/log/start.log && atd && node ./webhook.js