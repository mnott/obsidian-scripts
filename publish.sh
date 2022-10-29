#!/bin/bash
#
# Uses: https://crates.io/crates/obsidian-export
#



#export PATH=~/.cargo/bin/:$PATH;

#rm -rf .documentation/*

#obsidian-export --no-git . .documentation 2>&1 | grep -v -e "^\$" | grep -v "Warning: Unable to find" | grep -v "Reference: " | grep -v "Source: "

#
# Clean up output directory
#
#rm -rf .documentation/Scripts
#mv .documentation/Obsidian/* .documentation
#rm -rf .documentation/Obsidian

#
# Rewrite the Scripts to scripts
#
#find Documentation/ -iname "*md" -print0 | xargs -0 perl -pi -e 's!../../../Scripts!../../../scripts!g'

#
# Restore Links to Lines
#
#find Documentation/ -iname "*md" -print0 | xargs -0 perl -pi -e 's!(../../)([Ss])(cripts.*#)l(\d.*)!\1s\3L\4!g'



#
# Replace Labels with HTML labels
#
# Obsidian Prefixes Labels with a caret. These
# work as link targets within Obsidian. When
# we publish the export to GitHub, we need to
# modify those link targets so that they act
# as "normal" html links. The exporter will
# already do the right thing for the link source,
# but it will leavel the link targets as plain text
# in the output. So we need to not modify the link
# sources, but the link targets, and wrap them with
# HTML label tags.
#
# 1. Protect link sources
#find . -iname "*md" -print0 | xargs -0 perl -pi -e 's/(\s)\^(\w*])/\1\2/g'
# 2. Modify link targets
#find . -iname "*.md" -print0 | xargs -0 perl -pi -e 's/(\s)\^(\w*)/\1<a name="\2"\/>/g'


#
# Rename .rd.md to README.md for README.md files
#
#find .documentation/ -iname "*.rd.md" -execdir rename 's/.*/README.md/' '{}' \;
#find .documentation/ -iname "*.md" -print0 | xargs -0 perl -pi -e 's/\/[^\/]*?\.rd\.md/\/README.md/g'


#
# Publish
#
git pull && \
git add . && \
git commit -i . -m "Documenation Update: `date +\"%Y-%m-%d %H:%M:%S\"`" && \
git push

read -p "Press Enter..."

#exit


