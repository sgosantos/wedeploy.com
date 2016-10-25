# Landing

> Contains the [wedeploy.com](http://wedeploy.com) static pages like homepage, docs, etc.

## Setup

1. Make sure you have [Node.js and npm](https://nodejs.org/en/download/) installed:

	```sh
node -v && npm -v
	```

2. Install our global dependencies:

	```sh
npm install -g bower gulp
	```

3. Install our local dependencies:

	```sh
npm install && bower install
	```

## Usage

* Build the site locally:

	```
gulp build
	```

	This will create a `dist` folder with everything inside of it.

* Run the site on a local server:

	```
gulp server
	```

	This will run the `build` task and serve all generated files.

* Deploy to github pages:

	```
gulp deploy
	```

	This will run the `build` task and send to `gh-pages` branch.

## License

[BSD License](./LICENSE.md) © Liferay, Inc.
