# Report:
## Application security
Describe what you have done to make your application secure, both in code and when configuring your application server.

I have used helmet(), which protects against XSS attacks and is built into the code. On the server side, I used the GitLab API to identify myself, which increases security. To identify users, a command in the app generates a secret http:// link that is pasted into the env file. If this cannot be done, the user will be thrown a 401. I used GitLab token to authenticate myself when making requests and webhook secret to verify that requests to my app come from GitLab.

## External modules
Which extra modules did you use in the assignment? Motivate the use of them and how you have to ensure that they are secure enough for production.

I chose not to use any extra modules and stuck to standard ones. This made the application simpler and reduced sources of error in coding. Troubleshooting became easier and faster.

## Environment variables
How do you handle your environment variables and how do development differ from production?

I use environment variables to reduce errors. Variables are defined in one place in an .env file, and adjustments are made only in one place in the code when needed. In development, adjustments are easier to make. When the application is in operation, anyone can maintain it since adjustments can be made with clear documentation. All variables are saved in environment variables. Since the .env file is part of gitignore, it will only be available where the code runs and not uploaded when committing.

## Reflection
Your thoughts on the assignment. What was hard, what have you learned? What could you have done differently?

I found webhook and WebSocket difficult initially due to new concepts and functions. Testing was necessary to understand their features better and how to use them for the task. Completing the task helped me learn how to handle them and understand their benefits in application development.

The task was based on clear examples and instructions, and we learned the necessary concepts in the course. I don't think I could have done anything differently, but exploring how these techniques are used in existing applications would have been interesting.

## Further improvements
Further improvements of the assignment. What could you have done but did not have the time to complete?

I could have made the first page of customer applications more visually appealing by working more structured with CSS coding. However, this was not my focus, but I would have prioritized it if I had more time.

The content on the first page could have been more extensive, but the task did not demand much content. I focused on understanding what needed to be done, how it needed to be done, and why it needed to be done.

## Feedback
Feedback to the course management about the assignment.

The task was not very difficult as it was based on B1: CRUD. However, I learned two essential techniques, webhook and WebSocket, which are useful for creating dynamic applications. They are helpful for games, chat applications, and other dynamic applications. As AI develops, they will become even more useful.