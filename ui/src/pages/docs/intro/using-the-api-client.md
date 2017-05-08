---
title: "Using the API Client"
description: "Make requests to WeDeploy using a standardized interface."
headerTitle: "Intro"
layout: "guide"
weight: 8
---

### {$page.title}

###### {$page.description}

<article id="1">

## Javascript API Installation

In order to send/receive requests to/from WeDeploy, we need to include the JavaScript API Client. This library provides a secure and reliable communication channel with WeDeploy. We can do that by simply adding a script tag in a HTML file:

```xml
<script src="http://cdn.wedeploy.com/api/latest/wedeploy.js"></script>
```

</article>

<article id="2">

## Swift API Installation

If you want to send/receive requests to/from WeDeploy from an iOS App, we also have a solution for that, the Swift API Client. In order to start using it you have to do:

#### Cocoapods

Add this to your Podfile

```swift
pod 'WeDeploy'
```

#### Carthage

Add this to your Cartfile

```swift
github 'wedeploy/api-swift'
```

#### API nuances

By default, all swift api requests returns a promise, for example:

```swift
WeDeploy
	.data("http://datademo.wedeploy.io");
	.get(resourcePath: "movies")
	.then { movie in 
		print(movie)
	}
```

But you will be able to return a callback or even an observable! You will have this two methods available:

```swift
// The method toCallback converts a promise into a callback
WeDeploy
	.data("http://datademo.wedeploy.io");
	.get(resourcePath: "movies")
	toCallback { movies, error in
		// here you can check the error or the response
	}

// The method toObservable converts a promise into an observable
WeDeploy
	.data("http://datademo.wedeploy.io");
	.get(resourcePath: "movies")
	.toObservable()
	.subscribe(
		onNext: { movies in
			// here you receive the movies
		},
		onError: { error in
			// oops something went wrong
		}
	)
```

</article>

<article id="3">

## Android API Installation

For sending/receiving requests to/from WeDeploy from an Android App, you can use the Android API Client. In order to start using it, you just need to add the following line to your build.gradle file:

```groovy
compile 'com.wedeploy:com.wedeploy.android:beta-20170505'
```

#### API nuances

Before calling any method from WeDeploy, you have to build its instance:

```java
WeDeploy weDeploy = new WeDeploy.Builder().build();
```

Then, you are able to synchronously fire requests to WeDeploy by calling execute():

```java
weDeploy
	.data("http://datademo.wedeploy.io")
	.get("movies")
	.execute();
```

You can also fire asynchronous requests by specifying a Callback to the execute() method:

```java
weDeploy
	.data("http://datademo.wedeploy.io")
	.get("movies")
	.execute(new Callback() {
		public void onSuccess(Response response) {
			// here you receive the movies
		}

		public void onFailure(Exception e) {
			// oops something went wrong
		}
	});
```

</article>
