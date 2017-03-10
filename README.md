# monasca-grafana-app

Plugin for Grafana to implement an "app" to provide screens for viewing or
configuring parts of Monasca which do not fit the traditional dashboard
format. This currently includes:

## Installation

To install into an existing Grafana deployment, firstly ensure the Monasca
datasource plugin for Grafana is deployed an operational. This will be used
to proxy requests to the monasca-api services. Having that in place, do the
following:

```
git clone https://github.com/stackhpc/monasca-grafana-app /var/lib/grafana/plugins
service grafana-server restart
```

Navigate to the "Plugins" screen of Grafana, then to the "Apps" section. Choose
to enable the Monasca app, and select the datasource you would like to use as
a means of accessing the monasca-api service.

## Build

Install system dependencies (these work for Ubuntu 16.04):

```
sudo apt-get install nodejs nodejs-legacy npm
```

Navigate to source directory and install grunt locally (not system-wide).

```
npm install grunt
npm install grunt-cli
```

Fetch project-specific dependencies:

```
npm install
```

To build:

```
./node_modules/.bin/grunt
```
