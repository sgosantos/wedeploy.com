---
title: "Sign-in With Password"
description: "You can let your users authenticate with WeDeploy using their email addresses and passwords."
headerTitle: "Auth"
layout: "guide"
weight: 6
---

### {$page.title}

###### {$page.description}

<article id="1">

## Sign-in with password

To sign in by email and password, call `signInWithEmailAndPassword`:

```javascript
WeDeploy
	.auth()
	.signInWithEmailAndPassword("user@domain.com", "password")
	.then(function(user) {
		// User is signed in.
	})
	.catch(function(err) {
		// User is not signed in.
	});
```

</article>

## What's next?

* Now you can start building your apps with authentication.
