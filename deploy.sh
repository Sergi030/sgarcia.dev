#!/bin/bash

checkCommand () {
    if [ $? -ne 0 ]
    then
        echo "$1"
        exit 1
    fi

}

fancyMessage () {
    printf "\033[0;32m$1\033[0m\n"
}

if [ "$1" == "nobuild" ]
then
    NOBUILD="nobuild"
fi


if [ -z $NOBUILD ]
then
    fancyMessage "Building site"
    # Build the project.
    hugo # if using a theme, replace with `hugo -t <YOURTHEME>`
fi

# Go To Public folder
cd public

# Check if there is any change
if ! git diff --quiet remotes/origin/HEAD
then

    # Add changes to git.
    fancyMessage "Adding Changes"
    git add .
    checkCommand "Cannot add any change"

    # Commit changes.
    fancyMessage "Commit the new build"
    msg="rebuilding site $(date)"
    git commit -m "$msg"
    checkCommand "Cannot commit the changes"

    # Push source and build repos.
    fancyMessage "Pushing changes"
    git push origin master
    checkCommand "Cannot push changes"
fi
