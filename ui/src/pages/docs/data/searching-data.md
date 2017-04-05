---
title: "Searching Data"
description: "Advanced queries using search."
headerTitle: "Data"
layout: "guide"
weight: 7
---

### {$page.title}

###### {$page.description}

<article id="1">

## Search data

We did some great stuff with basic data methods, like create, update, and delete JSON documents. We also learned how to retrieve documents with where, sort, and pagination. What if we need more powerful queries with our documents? In WeDeploy you can do a text search, handle user misspellings, and show the number of documents by category with your data, and much more.

First take a look at the text search. It's a simple, yet very powerful way to filter our results by a text query. Using the movie database we created before, let's search for a Star Wars movie by the episode title, like "Revenge of the Sith". We are not interested if the letter is in upper or lower case, since we are using English connectors like "of" and "the". We want something flexible enough that it will also work for texts like "The revenge of the Sith", or "Sith's revenge". Our match operator is flexible enough for both.

```javascript
WeDeploy
	.data('http://datademo.wedeploy.io')
	.match('title', "Sith's revenge")
	.get('movies')
	.then(function(movies) {
		console.log(movies);
	});
```
```swift
WeDeploy
	.data("http://datademo.wedeploy.io")
	.match(field: "title", pattern: "Sith's revenge")
	.get(resourcePath: "movies")
	.then { movies in
		print(movies)
	}
```
```java
WeDeploy
	.data("http://datademo.wedeploy.io")
	.where(match("title", "Sith's revenge"))
	.get("movies")
	.execute();
```

The result of the match operator query is the following entry:

```javascript
[{"id":"star_wars_iii","title":"Star Wars: Episode III - Revenge of the Sith","year":2005,"rating":7.7}]
```

We can also use simple text operators in our match:

```javascript
// we can run this
WeDeploy
	.data('http://datademo.wedeploy.io')
	.match('title', '(jedi | force) -return')
	.get('movies')
	.then(function(movies) {
		console.log(movies);
	});

// or this
WeDeploy
	.data('http://datademo.wedeploy.io')
	.match('title', 'awake*')
	.get('movies')
	.then(function(movies) {
		console.log(movies);
	});

// or even this
WeDeploy
	.data('http://datademo.wedeploy.io')
	.match('title', 'wakens~')
	.get('movies')
	.then(function(movies) {
		console.log(movies);
	});
```
```swift
// we can run this
WeDeploy
	.data("http://datademo.wedeploy.io")
	.match(field: "title", pattern: "(jedi | force) -return")
	.get(resourcePath: "movies")
	.then { movies in
		print(movies)
	}

// or this
WeDeploy
	.data("http://datademo.wedeploy.io")
	.match(field: "title", pattern: "awake*")
	.get(resourcePath: "movies")
	.then { movies in
		print(movies)
	}

// or even this
WeDeploy
	.data("http://datademo.wedeploy.io")
	.match(field: "title", pattern: "wakens~")
	.get(resourcePath: "movies")
	.then { movies in
		print(movies)
	}
```
```java
// we can run this
WeDeploy
	.data("http://datademo.wedeploy.io")
	.where(match("title", "(jedi | force) -return"))
	.get("movies")
	.execute();

// or this
WeDeploy
	.data("http://datademo.wedeploy.io")
	.where(match("title", "awake*"))
	.get("movies")
	.execute();

// or even this
WeDeploy
	.data("http://datademo.wedeploy.io")
	.where(match("title", "awake~"))
	.get("movies")
	.execute();
```

Any search in the previous example results in the following match:

```javascript
[{"id":"star_wars_vii","title":"Star Wars: Episode VII - The Force Awakens","year":2015}]
```

What we did with * can also be done with the prefix operator Filter.prefix('title', 'awake'). The fuzziness we added to 'wakens' using ~, can also be done explicitly with the fuzzy operator Filter.fuzzy('title', 'wakens').

So far we are still just filtering data with filters. We can do so much more than that! If we use 'query search' instead of 'filter' to send those filters to the server, we can also get information about how relevant a document is to a given search, and order our results by this criteria. Let us introduce this with a new filter that allows us to query movies with a title similar to a given text:

```javascript
WeDeploy
	.data('http://datademo.wedeploy.io')
	.similar('title', 'The attack an awaken Jedi uses to strike a Sith is pure force!')
	.search('movies')
	.then(function(movies) {
		console.log(movies);
	});
```
```swift
WeDeploy
	.data("http://datademo.wedeploy.io")
	.similar(field: "title", query: "The attack an awaken Jedi uses to strike a Sith is pure force!")
	.search(resourcePath: "movies")
	.then { movies in
		print(movies)
	}
```
```java
WeDeploy
	.data("http://datademo.wedeploy.io")
	.where(similar("title", "The attack an awaken Jedi uses to strike a Sith is pure force!"))
	.search("movies")
	.execute();
```

We receive not only the documents that match the filter, but also search metadata:

```javascript
{
	"total": 5,
	"documents": [
		{
			"title": "Star Wars: Episode VII - The Force Awakens",
			"id": "star_wars_vii"
		},
		{
			"title": "Star Wars: Episode V - The Empire Strikes Back",
			"id": "star_wars_v"
		},
		{
			"title": "Star Wars: Episode VI - Return of the Jedi",
			"id": "star_wars_vi"
		},
		{
			"title": "Star Wars: Episode III - Revenge of the Sith",
			"id": "star_wars_iii"
		},
		{
			"title": "Star Wars: Episode II - Attack of the Clones",
			"id": "staw_wars_ii"
		}
	],
	"scores": {
		"star_wars_ii": 0.13102644681930542,
		"star_wars_iii": 0.13102644681930542,
		"star_wars_v": 0.13102644681930542,
		"star_wars_vi": 0.13102644681930542,
		"star_wars_vii": 0.5241057872772217
	},
	"queryTime": 1
}
```

Notice that the score of the star_wars_vii document is bigger than the other matches, indicating its title is more similar to the given filter than the others. The documents in the result are now ordered by the relevance of the document, expressed as a number in the scores metadata, rather than the document's ID. Now we can show not only filtered results, but also order our results by relevance!

Want more? Well, let's make things even easier for the user! Adding one entry to the search query, we can automatically highlight the words that matched our query, showing not only how relevant the document is to the search, but also where it matches our criteria. We can do this with small changes in our previous search, using the following code:

```javascript
WeDeploy
	.data('http://datademo.wedeploy.io')
	.similar('title', 'The attack an awakened Jedi uses to strike a Sith is pure force!')
	.highlight('title')
	.search('movies')
	.then(function(movies) {
		console.log(movies);
	});
```
```swift
WeDeploy
	.data("http://datademo.wedeploy.io")
	.similar(field: "title", query: "The attack an awaken Jedi uses to strike a Sith is pure force!")
	.highlight(field: "title")
	.search(resourcePath: "movies")
	.then { movies in
		print(movies)
	}
```
```java
WeDeploy
	.data("http://datademo.wedeploy.io")
	.where(similar("title", "The attack an awakened Jedi uses to strike a Sith is pure force!"))
	.highlight("title")
	.search("movies")
	.execute();
```

As you can see in the code below, our keywords are highlighted in the results:

```javascript
{
	"total": 5,
	"documents": [
		{
			"title": "Star Wars: Episode VII - The <em>Force</em> <em>Awakens</em>",
			"id": "star_wars_vii"
		},
		{
			"title": "Star Wars: Episode V - The Empire <em>Strikes</em> Back",
			"id": "star_wars_v"
		},
		{
			"title": "Star Wars: Episode VI - Return of the <em>Jedi</em>",
			"id": "star_wars_vi"
		},
		{
			"title": "Star Wars: Episode III - Revenge of the <em>Sith</em>",
			"id": "star_wars_iii"
		},
		{
			"title": "Star Wars: Episode II - <em>Attack</em> of the Clones",
			"id": "star_wars_ii"
		}
	],
	"scores": {
		"star_wars_ii": 0.13102644681930542,
		"star_wars_iii": 0.13102644681930542,
		"star_wars_v": 0.13102644681930542,
		"star_wars_vi": 0.13102644681930542,
		"star_wars_vii": 0.5241057872772217
	},
	"queryTime": 1
}
```

The third search feature is also quite simple, but can be applied to generate meaningful statistical information about our data. What if we need to compare the average rating the first three movies received, with the last three movies? We can do that with aggregations, using the following code:

```javascript
WeDeploy
	.data('http://datademo.wedeploy.io')
	.lt('year', 1990)
	.aggregate('Old Movies', 'rating', 'avg')
	.count()
	.get('movies')
	.then(function(aggregation) {
		console.log(aggregation);
	});
```
```swift
WeDeploy
	.data("http://datademo.wedeploy.io")
	.lt(field: "year", value: 1990)
	.aggregate(name: "Old movies", field: "rating", op: "avg")
	.count()
	.get(resourcePath: "movies")
	.then { (aggregation: [String : Any]) in
		print(aggregation)
	}
```
```java
WeDeploy
	.data("http://datademo.wedeploy.io")
	.where(lt("year", 1990))
	.aggregate(avg("Old Movies", "rating"))
	.count()
	.get("movies")
	.execute();
```

The count we added to the query informed the server that we are not interested in the documents themselves, but rather the number of matches and search metadata. The result, in this case, will be the following data:

```javascript
{
	"total": 3,
	"queryTime": 13,
	"aggregations": {
		"Old Movies": 8.633333333333333
	}
}
```

Cool, right? Simply run another query for the newest movies, and then you'll have the data you need to compare them. There are some additional operators that you might find useful: min, max, sum, histogram, and even a generic stats that returns several statistics over the field. Take a look at the example below to see results using the additional operators:

```javascript
{
	"total": 3,
	"queryTime": 8,
	"aggregations": {
		"Old Movies": {
			"average": 8.633333333333333,
			"count": 3,
			"max": 8.8,
			"min": 8.4,
			"name": "Old Movies",
			"standardDeviation": null,
			"sum": 25.9,
			"sumOfSquares": null,
			"variance": null
		}
	}
}
```

Notice that in order to read and write your service's root path you need to map it with an API endpoint and data flag active.
If we want to inform the server of the data type of a collection field before it receives its first document, we can POST/PATCH the data root with the mapping information:

```javascript
WeDeploy
	.url('http://datademo.wedeploy.io')
	.post({
		"places": {
			"location": "geo_point"
		}
	});
```
```swift
WeDeploy
	.url("http://datademo.wedeploy.io")
	.post(body: [
		"places" : [
			"location" : "geo_point"
		]
	])
```
```java
JSONObject locationJsonObject = new JSONObject()
	.put("location", "geo_point");

JSONObject placesJsonObject = new JSONObject()
	.put("places", locationJsonObject);

WeDeploy
	.data("http://datademo.wedeploy.io")
	.create("", placesJsonObject);
```	

We can never update an already mapped field, but we can map new fields in an existing collection, as we did in the request above. When we manually map our collection, we can use some extra datatypes that are not mapped dynamically: date, geo_point, and geo_shape. We will focus on geo_point for this next feature.

So, we mapped a field called location, in the collection places, as representing a geolocation point. This means we can operate, filter, and aggregate the places we put in that collection, using geo filters over this field! Let's try something simple: find cinemas close to London's Waterloo Station. To run the search criteria, we'll use the following code:

```javascript
WeDeploy
	.data('http://datademo.wedeploy.io')
	.any('category', 'cinema')
	.distance('location', '51.5031653,-0.1123051', '1mi')
	.get('places')
	.then(function(places) {
		console.log(places);
	});
```
```swift
WeDeploy
	.data("http://datademo.wedeploy.io")
	.any(field: "category", value: ["cinema"])
	.distance(field: "location", latitude: 51.5031653, longitude: -0.1123051, distance: .mile(1))
	.get(resourcePath: "places")
	.then { places
		print(places)
	}
```
```java
WeDeploy
	.data("http://datademo.wedeploy.io")
	.where(any("category", "cinema").and(distance("location", "51.5031653,-0.1123051", "1mi")))
	.get("places")
	.execute();
```

Our result is the following matches:

```javascript
[
	{
		"name": "BFI IMAX",
		"location": "51.5126928,-0.12052",
		"id": "116686224946770924",
		"category": [
			"cinema"
		]
	},
	{
		"name": "Cinema Museum",
		"location": "51.501661,-0.1177734",
		"id": "116686224946770925",
		"category": [
			"cinema",
			"museum"
		]
	},
	{
		"name": "Roxy Bar and Screen",
		"location": "51.5012603,-0.1146835",
		"id": "116686224946770926",
		"category": [
			"cinema",
			"bar",
			"restaurant"
		]
	}
]
```

Now we can plug a map to our app, and let users see and filter places, with just a few lines of code.

</article>

## What's next?

Now that you have learned how to retrieve data, you can interact with [real-time feeds](/docs/data/real-time-feeds.html).
