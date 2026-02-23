# WDS Integration Spec for BMAD Viewer

## 1. What is WDS?

Whiteport Design Studio (WDS) is a design-focused methodology module for the BMad Method ecosystem. It uses AI agents (Saga, Freya, Idunn, Mimir) to guide users through 6 design phases, producing strategic design documents.

## 2. WDS Output Structure (in user projects)

WDS installs into `_wds/` (system files) and outputs deliverables to `docs/`:

```
project/
├── _wds/                          # WDS system (agents, workflows, config)
│   ├── agents/
│   ├── workflows/
│   ├── data/
│   ├── gems/
│   ├── templates/
│   ├── config.yaml
│   └── module.yaml
├── _wds-learn/                    # Optional learning material
├── docs/                          # ← WDS design output
│   ├── A-Product-Brief/
│   ├── B-Trigger-Map/
│   ├── C-Platform-Requirements/
│   ├── C-Scenarios/
│   ├── D-Design-System/
│   ├── E-PRD/Design-Deliveries/   # DD-XXX files
│   └── F-Agent-Dialogs/
├── _bmad-output/                  # ← BMad Method output (existing)
```

### Key findings:
- WDS outputs are in `docs/` — **completely separate from `_bmad-output/`**
- There's no sprint-status.yaml or story files in WDS output
- WDS deliverables are markdown documents (product briefs, trigger maps, page specs, design deliveries)
- A project can have BOTH `_bmad-output/` and `docs/` (WDS + BMad together)

## 3. Current BMAD Viewer Architecture

BMAD Viewer currently:
1. **`listBmadFiles()`** in `server/utils/github.ts` — filters tree to `_bmad-output/` prefix only
2. **`fetchDocumentTree()`** — builds document tree from those files
3. **`fetchSprintStatus()`** — looks for `sprint-status.yaml` in `_bmad-output/`
4. **3 tabs**: Roadmap (sprints), Epics & Stories, Documents (file tree)

WDS repos would show **empty** in BMAD Viewer because nothing is in `_bmad-output/`.

## 4. Integration Plan

### Phase 1: Detect & List WDS Documents

**Goal:** Show WDS `docs/` files in the Documents tab alongside `_bmad-output/` files.

#### Changes:

**`server/utils/github.ts`** — Add `listWdsFiles()`:
```typescript
export async function listWdsFiles(octokit, owner, repo, ref?) {
  // Same as listBmadFiles but filter for docs/ prefix
  // Also detect _wds/ presence to confirm it's a WDS project
}
```

**`server/api/github/tree.get.ts`** — Merge both file lists, grouped by source.

**`app/composables/useGitHub.ts`** — Update `fetchDocumentTree()` to include WDS docs.

**`shared/types/bmad.ts`** — Add `source?: 'bmad' | 'wds'` to `BmadDocument`.

### Phase 2: WDS-Aware Document Viewer

**Goal:** Render WDS documents with proper context (phase labels, deliverable types).

#### WDS Phase Mapping:
| Folder prefix | Phase | Label |
|---|---|---|
| `A-Product-Brief` | 1 | Product Exploration |
| `B-Trigger-Map` | 2 | Trigger Mapping |
| `C-Platform-Requirements` | 3 | Platform Architecture |
| `C-Scenarios` | 4 | UX Design |
| `D-Design-System` | 5 | Visual Design |
| `E-PRD` | 6 | Design Delivery |
| `F-Agent-Dialogs` | — | Agent Dialogs |

### Phase 3: WDS Progress Overview (optional, future)

WDS doesn't have a sprint-status.yaml equivalent. Progress tracking would require:
- Counting documents per phase folder
- Detecting phase completion heuristics
- This is **speculative** and should NOT be in v1

## 5. Implementation Steps

### Step 1: Extend file listing to include `docs/` when `_wds/` is detected
- Modify `listBmadFiles` or add parallel function
- Server API returns combined tree with source markers

### Step 2: Update Document Tree UI
- Group WDS docs under a "WDS Design Documents" section
- Show phase icons/labels based on folder prefix
- Keep existing `_bmad-output/` display unchanged

### Step 3: Add WDS detection badge
- Show "WDS" badge on repo card/header when `_wds/module.yaml` exists
- Purely cosmetic, helps users know WDS is detected

## 6. Risks & Concerns

1. **`docs/` is generic** — Many repos have a `docs/` folder for unrelated content. We MUST check for `_wds/` presence before treating `docs/` as WDS output. False positives would be confusing.

2. **No structured data** — WDS has no equivalent to `sprint-status.yaml`. The Roadmap and Epics tabs will remain empty for WDS-only projects. This is fine for v1.

3. **Folder naming convention may change** — The `A-Product-Brief`, `B-Trigger-Map` naming is current but could change. We should be resilient.

4. **Separate vs combined repos** — WDS users may have specs in a separate repo from code. BMAD Viewer already supports any repo, so this works.

## 7. Recommendation

**Proceed with implementation.** The integration is straightforward and low-risk:
- It's additive (no changes to existing BMad parsing)
- Detection is reliable (`_wds/` folder presence)
- Fallback is graceful (repos without WDS work identically)
- Documents tab already supports arbitrary markdown files

The main value is: WDS users can browse their design documents in BMAD Viewer's polished UI instead of raw GitHub file browsing.
