# Agent Instructions (Balance)

When working in this repository, follow `docs/AI_CONTEXT.md` as the source of truth for workflow behavior.

## Publish Command Behavior

When the user says `publish`, do the following exactly:

1. Update `docs/BUILD_NOTES.md` if changes were made.
2. Update `docs/ARCHITECTURE.md` if architecture changed.
3. Run `scripts/publish.ps1` to stage, commit, and push.
4. Ensure publish completion sound plays: `C:\Home\Jim\System\sounds\gotthis.wav`.

## Sound Routing

- If a blocking prompt/decision is required, play `C:\Home\Jim\System\sounds\garage.wav` before asking.
- At completion checkpoints, play `C:\Home\Jim\System\sounds\gotthis.wav`.
