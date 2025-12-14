Work on an article. If a path is provided, use it: $ARGUMENTS

If no path is provided, use the DevTools MCP to detect the current article:
- Call `mcp__chrome-devtools__take_snapshot` to get the page content
- Look for the article title, URL path, or content to identify which article the user is viewing
- Match it to a file in `src/content/concepts/` or `src/content/pages/`

Follow this process:

1. **Load guidelines** — Read `.claude/skills/copywriting/SKILL.md` for voice, terminology, and anti-anthropomorphization rules.

2. **Check dependencies** — Read all concept pages in `src/content/concepts/` and map the `dependsOn` structure. Only reference concepts that appear earlier in the dependency chain.

3. **Review existing content** — Read the target article and any related pages to understand current state.

4. **Write/edit content** following these rules:
   - ELI5: Simple, clear language
   - Short and direct: No fluff
   - Concrete over abstract: Show, don't explain
   - No anthropomorphization: Use "outputs", "pattern-matches", "selects"—not "thinks", "wants", "decides"

5. **Verify** — Re-read the final content and check:
   - No concepts introduced before their dependency
   - No anthropomorphic language
   - Succinct (cut filler words)

## Working with TODO Articles

If the article contains TODO markers or placeholder content:
- Identify what sections need to be filled in
- Propose content that fits the pattern catalog style
- Keep the same structure and formatting as completed articles
- After completing one TODO article, offer to help with the next one

Wait for user direction before committing.
