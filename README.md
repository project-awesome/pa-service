# pa-service

To run locally:


```
npm install
foreman start web

```

then check on localhost:5000

try:

http://localhost:5000/v1/...

Where ... is whatever url you are looking for.

Some things to try:

These are GET requests, so you can test them by just putting 
this URL directly in the browser:

http://localhost:5000/v1/list?type=questionType
http://localhost:5000/v1/check?type=seed&value=ABCD1234
http://localhost:5000/v1/check?type=questionType&value=paq-fr-multiple-choice

These are POST, so you may have to do something different
(TBD: write how to test this...)

http://localhost:5000/v1/generate?type=json&seed=ABCD1234
http://localhost:5000/v1/generate?type=moodleXML&seed=ABCD1234

For generate, there is another parameter, the quiz descriptor.

qd is short for "quiz descriptor".

Example quiz descriptors can be found here:

https://github.com/project-awesome/project-awesome/tree/master/Examples

Each qd describes how many question, of what types,
what parameters to the questions, and what order.

The qd value to generate is supplied via POST
parameter, because its great big and putting it in the
URL requires urlencoding it, which is hard to do by
hand, and taking a big long multi-line thing and
stripping out all the lines breaks.