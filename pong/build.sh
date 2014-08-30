#!/bin/bash

cd /root/limejs
bin/lime.py build pong -o lime/demos/pong/compiled/pong.js 
cp lime/demos/pong/compiled/pong.js ~/pong_server/compiled
