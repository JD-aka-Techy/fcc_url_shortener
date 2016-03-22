API Basejump: URL Shortener
=========================
User stories: 
---------------
1) I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.  
2) When I visit that shortened URL, it will redirect me to my original link.

Example creation usage:

  * {base url}/new/https://www.google.com  
  * {base url}/new/http://freecodecamp.com/

Example creation output:

 * { "original": "http://freecodecamp.com/", "redirect":{base url}/4 }

Usage:

* {base url}/4

Will redirect to:

* http://freecodecamp.com/