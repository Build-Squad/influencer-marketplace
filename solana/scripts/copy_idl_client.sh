#!/bin/bash

diff target/idl/xfluencer.json ../solana-client/xfluencer.json
read -p "Are you sure of your Idl changes?. Press 'y' to continue (y/n)?" choice
case "$choice" in 
  y|Y ) echo "idl was copied to the client";cp target/idl/xfluencer.json ../solana-client/xfluencer.json;;
  n|N ) echo "no idl copy was done";;
  * ) echo "invalid";;
esac

