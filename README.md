# Visory engineering challenge

We at Visory want to find out if we are a great fit for each other. Instead of a high pressure timed developer quiz, we want to see how you approach a problem and solve it in a more real-world environment.

The submission from this challenge will be used to discuss your approach to solving problems and your technical skills.

## Guidelines

- Use any language, framework, or tool you want.
- Dedicate approximately 3 hours of time on this assignment. Be biased on quality over quantity.
- Use git as source control and submit your code as a link to a public repository on Github or via email.
- Please organize, design, test, deploy, and document your solution as if you were going to put into production. We completely understand this might mean you can't do as much in the time budget, be prepared to discuss.

## The challenge

Build a small web application that helps users browse and discover events that they might be interested in. Leverage the Ticketmaster event discovery API (https://developer.ticketmaster.com/api-explorer/).

Feel free to use any framework, platform or delivery mechanism you wish to help you achieve your desired outcome.

The only requirements for the assignment are:

- We can filter by location
- We can provide a start and end datetime.
- Your code is well-tested.
- The README.md has been update with instructions to build and run your code.

Feel free to tackle this problem in a way that demonstrates your expertise of an area -- or takes you out of your comfort zone.

Good luck!

## Run this project locally

> npm i && npm run dev

You will also need to create a file named ".env.development" with the following format:

> VITE_TICKETMASTER_KEY=[enter your ticketmaster API key here]

And then you can visit the site at <http://localhost:5173>

If you wish to build it instead, create a file named ".env.production" with the same content. The command will be the following:

> npm i && npm run build-prod && npm run preview

And then you can visit the site at <http://localhost:4173>

The page that has filter and event listing would be displayed as the home page. You can filter the events by country.

It seems the Ticketmaster API does not provide an option to fetch the list of supported state codes or cities, so I have to skip that for now. Please let me know if you expect me to add any other features.
