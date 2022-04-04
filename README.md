# P2 

## About


## Contributors

Alexander Fredberg Manich  
Ali Sajad Khorami  
Anders Andresen Toft  
Emil Monraad Laursen  
Esben Baadsgaard Krogh  
Simon Mikkelsen Bejer  
Viktor Platz  

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Getting started](#getting-started)
    - [Installation](#installation)
3. [License](#license)

## Prerequisites
- [git](https://git-scm.com/)


## Getting started
### Installation


## License

Licensed under the [MIT](LICENSE) license.


# p1-project

## Setup

To run and build the project you will need CMake and Visual Studio 2019 installed on your computer. You can download CMake on the [CMake Website](https://cmake.org/download/). You can download Visual Studio 2019 on the [Visual Studio Website](https://visualstudio.microsoft.com/vs/).

When downloading CMake make sure that you choose to let it set a system path.

## Build setup

To setup for building the code open a cmd window and find the folder with the project in it and write the following commands.

```
mkdir build
cd build
cmake ../
```

You only have to do this once.

## Building

To build the code you have to be in the path of the build folder we made in the last step. If you are in the build folder you can run the following command to build.

```
cmake --build .
```

## Running the program

To run the program, run the exe file in the Debug folder.

## Git

For all the following commands you need to be in the git repo's path. 

### Checking the status of changes

```
git status
```

### Add a change to the commit

```
git add <file_name>
```

### Remove a change to the commit

```
git rm <file_name>
```

### Create and change branch

```
git checkout -b <Branch_Name>
```

### Commit added changes

```
git commit -m "<Commit_Message>"
```

### Push changes to github

```
git push -u origin <Branch_Name>
```

### Update the state of the repo

```
git fetch
```

### Download changes to the branch from github

```
git pull
```

For more info check this [cheatsheet](https://about.gitlab.com/images/press/git-cheat-sheet.pdf).
