## :stop_sign::stop_sign: This tool has been relocated to be part of the [mos-connection](https://github.com/nrkno/sofie-mos-connection) project. :stop_sign::stop_sign:


# Quick-MOS
An application for quick simulation of a MOS server/NCS.

## Requirements
* Install [yarn](https://yarnpkg.com/en/docs/install)

## Usage
* Clone the repo
* `yarn` to install
* `yarn start` to start the application


* The application will monitor the contents in the folder `/input` and send mos commands.
* Files and folders that begin with "_" (underscore) will be ignored

* Note: quickmos and mos-gateway must be run on different machines (or docker containers) as they both try to bind to the same ports. This is a limitation in the current implementation of mos-connection
