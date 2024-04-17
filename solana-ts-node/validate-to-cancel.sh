#!/bin/bash
json_data='{"bus":"GQRDv58u1dULSyHSYWPqNTjcWjsFHHi763mbqDaEEgQ3", "inf":"94fznXq73oweXLrg2zL75XAMy9xNEbqtb191Xcrq97QA", "oc":12354, "ts":1}'
ts-node validate-escrow-solana.ts "$json_data"
