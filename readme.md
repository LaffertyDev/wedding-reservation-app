# Wedding Reservation App

This home-cooked app serves as how my wedding guests will manage their reservation. I know we could use off-the-shelf software to do this (for mostly free) but I felt the itch to build it myself.

And now here we are!

## Deploying

Deploying is done from a GHA over SSH. Reminder for the future... I configured the SSH key on my laptop. If you need to update it, I need to generate a new key and copy the public key to my webserver's `authorized_keys` file. Then give Github the private key.

The files live under a separate directory from my main server. For ease-of-deployment, I prefixed `rsvp` to the routes... that way I can deploy them separately but still serve the files.

I also needed to change the default mime types allowed by nginx to permit `mjs` files sending as `application/javascript` instead of octet-stream.

## Frontend

Built using vanilla javascript wherever possible, with a hefty dose of web components.

Considerations:

* https://tailwindcss.com/
	* Tailwind UI
* Bulma.css
* Normalize.css


## Backend

For the backend, I wanted to try my hand at some new systems that I've heard about. For my day-job I heavily use Microsoft Azure so wanted to branch out to something a little more lightweight.

Considerations:

* 


## Database

I've heard really good things about Postgres, so I decided I wanted to rely on it.

## Core Design

Reservation // RSVP

Party/guests attending

Food choice

Kids

https://www.figma.com/file/ZyvMX9ARUXrdkUB0OySfej/Untitled

