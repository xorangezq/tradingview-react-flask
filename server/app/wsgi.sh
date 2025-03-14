#!/bin/bash

gunicorn -w 1 --threads 1 -b 0.0.0.0:3000 wsgi:server --log-level=debug --log-file gunicorn.log -t 0
