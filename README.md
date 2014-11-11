Socket-RPS
==========

Rock paper Scissors Written with Sockets

Install Node http://nodejs.org/
Install Bower http://bower.io/

`$ npm install`
`$ bower install`
`$ npm start`

Whats nice in this little project is...
* Decent use of event emitters
* taking advantage of object by reference in node to act like a db
* Cute Little Bower Script that doesn't make the entire bower folder public
* And of course, Sockets

Considering Consolodating everything into "logic" or perhaps calling it "apps" 
In this manner, I wouldn't have 1 public folder but have a public in each of the apps
Then write a regex that will ask for a `/.*\/public\/.*/` and attempt to send the file so long as the person
isn't trying to go crazy with file directory structure (eg /../)

That being said, its cute and simple.
Once I get windows 8.1 I can add it Realsense to in which may be interesting
