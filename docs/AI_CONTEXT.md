# AI Context

This repository hosts **Balance**, a static website project.

The project uses HTML, CSS, and JavaScript with no build system.

## Important Files

- ARCHITECTURE.md -> high-level project structure and module boundaries
- BUILD_NOTES.md -> development notes and changelog

## Development Rules

When modifying this project:

- Prefer small targeted edits
- Do not rewrite files unnecessarily
- Keep compatibility with static hosting

## Publish Workflow (Agent Rule)

Agent instruction:
When the user says **publish**, execute the following workflow exactly:

1. Update BUILD_NOTES.md if any changes were made
2. Update ARCHITECTURE.md if architecture changed
3. Run `scripts/publish.ps1` to commit and push
5. Ensure publish completion sound plays: `C:\Home\Jim\System\sounds\gotthis.wav`

Prefer one clean commit per publish.

## Prompt/Decision Alert (Agent Rule)

If a user prompt/decision is required to continue and cannot be safely assumed, play:

- `C:\Home\Jim\System\sounds\garage.wav`

Then ask the blocking question.

## Completion Checkpoint Alert (Agent Rule)

A "completion checkpoint" is when a requested task is finished, validated, and waiting on user direction (for example review or publish).

At completion checkpoints, play:

- `C:\Home\Jim\System\sounds\gotthis.wav`
