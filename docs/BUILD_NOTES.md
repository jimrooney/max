# Build Notes

## 2026-03-05

### AI Publish Preferences Initialized
- Added `AI_CONTEXT.md` with publish workflow rules for this repository.
- Added sound routing rules:
  - `gotthis.wav` for publish completion and completion checkpoints
  - `garage.wav` when a blocking prompt/decision is required
- Added root `AGENTS.md` so agents load publish/sound behavior immediately on project open.
- Added `scripts/publish.ps1` as the canonical publish command used by the workflow.
