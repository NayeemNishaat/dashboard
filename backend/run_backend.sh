#!/bin/bash
echo "Starting at $(date)"
export DEMO_ONBOARDED=true
export DEMO_SETUP_COMPLETE=true
ENV="demo" ./dashboard_mac_amd64
