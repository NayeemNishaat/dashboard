#!/bin/bash
rm .env.production
cp .env.prod .env.production
bash deploygzs3.sh "production"
