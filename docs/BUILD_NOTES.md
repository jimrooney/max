# Build Notes

## 2026-03-05

### AI Publish Preferences Initialized
- Added `AI_CONTEXT.md` with publish workflow rules for this repository.
- Added sound routing rules:
  - `gotthis.wav` for publish completion and completion checkpoints
  - `garage.wav` when a blocking prompt/decision is required
- Added root `AGENTS.md` so agents load publish/sound behavior immediately on project open.
- Added `scripts/publish.ps1` as the canonical publish command used by the workflow.

### Wind Ring UI Updates
- Added cardinal direction labels (`N`, `E`, `S`, `W`) to the wind ring in both `crosswind.html` and `takeoff.html`.
- Added a dynamic runway heading label that tracks the runway's top end while keeping text level.
- Updated ring styling to a dark blue-grey band-only ring (center left unfilled).
