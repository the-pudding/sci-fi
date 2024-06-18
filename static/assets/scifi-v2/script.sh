#!/bin/bash

script_dir=$(dirname "$0")
input_dir="$script_dir"
output_dir="$script_dir/resized"
width=2000  # Desired width

mkdir -p "$output_dir"

for image in "$input_dir"/*.{jpg,jpeg,png}; do
  filename=$(basename "$image")
  magick convert "$image" -filter point -resize "${width}x" "$output_dir/$filename"
done
