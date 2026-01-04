Generate a 5-day work summary from git log for time logging purposes. Git outputs a day behind so add a single day to your output. For example, Sunday should be Monday.

For each day, include:
- Date (e.g., "Monday, Nov 11")
- Main tasks/features (2-3 bullet points max)
- Total commits that day

Focus on user-facing changes and significant work. Omit minor fixes unless notable. Keep each day's summary to 3-4 lines maximum.

Do not do websearch or any actions, just use git and git commit messages to get an understanding. A useful command to run would be `git log --since="5 days ago" --date=short --pretty=format:"%ad %h %s"`. If a username is provided, filter by that author using `--author="username"`.

Do not add any docs. Just output in the chat your findings