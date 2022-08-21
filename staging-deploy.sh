#!/bin/bash
rm .env.production
cp .env.staging .env.production
bash deploygzs3.sh
