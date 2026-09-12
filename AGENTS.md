# AGENTS.md — Agent Guidelines & Engineering Standards (Global)

Behavioral guidelines to eliminate common LLM coding pitfalls, derived from [Andrej Karpathy's engineering observations](https://x.com/karpathy/status/2015883857489522876) and strict **Test-Driven Development (TDD)** methodology.

> **Tradeoff:** These guidelines bias toward caution, precision, and verification over speed. For trivial one-line tasks, exercise sound judgment, but never bypass testing discipline or surgical editing rules.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- **State assumptions explicitly**: If any requirement or edge case is ambiguous, articulate your assumptions and clarify before writing implementation code.
- **Present multiple interpretations**: When requirements allow more than one path, present the alternatives and tradeoffs rather than choosing silently.
- **Push back when warranted**: If a requested design or architecture is unnecessarily complex, inefficient, or brittle, proactively propose a cleaner, simpler alternative.
- **Stop when confused**: Never pretend to understand a confusing error or specification. Stop, isolate what is ambiguous, and request clarification.

---

## 2. Strict Test-Driven Development (TDD)

**No production code without a failing test first. Red → Green → Refactor.**

Every feature, bugfix, or behavioral change must follow the strict TDD cycle:

1. **RED (Failing Test First)**:
   - Write an automated test that defines the expected behavior or reproduces the exact bug.
   - Run the test suite and confirm that the test **fails** for the expected reason (not due to a typo or setup error).
2. **GREEN (Minimal Implementation)**:
   - Write *only* the minimum production code needed to make the failing test pass.
   - Do not prematurely write extra features, handling for unverified edge cases, or speculative abstractions.
   - Run the test suite to confirm it passes.
3. **REFACTOR (Clean Up)**:
   - Clean up code duplication, improve naming, and simplify logic while keeping all tests green.
   - Run the full test suite and linter to verify zero regression.

**Rules of TDD:**
- **Bug fixing**: Never fix a bug without first writing a test that reproduces it. The test failure is your proof of the bug; the green test is your proof of the fix.
- **Test isolation**: Keep unit tests fast, deterministic, and isolated. Avoid external side-effects or network calls in unit tests.
- **Project Test Runner**: If the project does not yet have a configured test runner (e.g., `vitest`, `jest`, `pytest`), propose and configure the minimal test runner required to support the TDD cycle before implementing new domain logic.

---

## 3. Simplicity First (YAGNI)

**Minimum code that solves the problem. Nothing speculative.**

- **No speculative features**: Implement only what was explicitly asked.
- **No single-use abstractions**: Do not build generic interfaces, helpers, or factories for code used in only one place. Inline or simplify instead.
- **No unrequested configurability**: Do not add extra flags, options, or environment toggles unless specifically requested.
- **No impossible error branches**: Avoid defensive programming for conditions that the type system or architecture guarantees cannot happen.
- **Conciseness rule**: If a 200-line solution can be written cleanly in 50 lines, rewrite it to 50 lines.
- **Self-check**: *"Would a senior engineer consider this overengineered?"* If yes, eliminate complexity.

---

## 4. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- **Zero collateral damage**: Never touch adjacent code, unrelated comments, or formatting styles.
- **Preserve working code**: Do not refactor code that is not directly related to the task.
- **Match repository style**: Adapt to existing code patterns, indentation, and conventions.
- **Unrelated issues**: If you encounter pre-existing bugs or dead code during your inspection, report them to the user—do not alter or delete them unsolicited.

When your changes create orphans:
- Remove unused imports, variables, types, or helper functions introduced or orphaned by *your* changes.
- Leave pre-existing unused code intact unless explicitly instructed.

**The Test:** Every changed line in `git diff` must trace directly back to the active user requirement.

---

## 5. Goal-Driven Execution & Verification

**Define verifiable criteria. Loop until verified.**

Transform imperative instructions into measurable, testable milestones:

| Imperative Request | Verifiable Goal |
| :--- | :--- |
| "Add email validation" | "Write tests for invalid/valid email formats, make them pass, verify with test runner." |
| "Fix header alignment on mobile" | "Reproduce alignment flaw, apply fix, inspect responsive layout/snapshots." |
| "Refactor function X" | "Verify existing tests pass, refactor cleanly, verify all tests still pass." |

For multi-step implementations, state a clear verification loop:
```
1. [Step 1] → verify: [command / test]
2. [Step 2] → verify: [command / test]
3. [Step 3] → verify: [command / test]
```

### Verification Checklist Before Claiming Complete:
- [ ] Automated tests pass completely.
- [ ] Typecheck passes without errors.
- [ ] Linter passes cleanly.
- [ ] `git status` / `git diff` reviewed to ensure zero unintended file modifications.

---

## 6. Git Workflow & Safety (Worktrees & Branch Isolation)

**Zero automated pushes. Zero automated merges. Total branch isolation.**

- **No automatic push or merge**:
  - NEVER execute `git push` or `git merge` automatically or unsolicited.
  - Pushing to remote repositories or merging branches requires explicit user request and review.
- **Never work or push directly to `main`**:
  - The `main` branch is protected. Direct commits or pushes to `main` are strictly prohibited.
  - All development must happen on dedicated, descriptive topic branches (e.g., `feature/<topic>`, `fix/<issue>`, `refactor/<name>`).
- **Mandatory Git Worktrees**:
  - Always develop within an isolated **git worktree** (`git worktree add ...`) associated with the specific feature/task branch.
  - Never dirty or mutate the primary working tree while developing features or spikes.
  - When the task is verified and complete, clean up temporary worktrees cleanly (`git worktree remove ...`) and leave branch integration to the user or explicit review.

---

## Summary

These guidelines are successful when:
1. `git diff` contains only minimal, surgical changes relevant to the task.
2. Every bug fix and feature is protected by automated tests.
3. Code is simple, readable, and free of speculative abstractions.
4. Ambiguities are raised and clarified before writing code, not after making mistakes.
5. `main` is protected: no direct pushes, no automatic pushes/merges, and all feature work is isolated in dedicated git worktrees.
