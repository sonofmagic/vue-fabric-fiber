This has been going on for ages. The problem is that whenever a matching version of a dependency is found to be already installed (based on lockfile and contents of node_modules), no install script is triggered for that dependency. One solution is to run cd ./node_modules/canvas && npx node-pre-gyp install --fallback-to-build --update-binary or npm rebuild after installing new dependencies.

However, I have several dependencies that need to install binaries the same way, and I've only been noticing this problem for canvas, so there might be something else going on with the way canvas handles it.

# Nodejs@18
