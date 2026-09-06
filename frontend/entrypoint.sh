#!/bin/sh
set -e

cp -r /dist/* /usr/share/nginx/html/

exec tail -f /dev/null
