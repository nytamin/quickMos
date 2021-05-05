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

## For use with Sofie and mos gateway
The tv-automation-mos-gateway acts both as a server and as a client.
So when running quickMOS and mos gateway on the same machine you need to hack the mos gateway to
not act only as a client, by setting the config.acceptsConnections to false in 
MOShandler.ts inside the _initMosConnection by adding:
```
		connectionConfig.acceptsConnections = false
```
just before creating the connection

And offcause: this hack is only for development purposes.