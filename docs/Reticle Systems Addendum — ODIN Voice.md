# Reticle Systems Addendum — ODIN Voice & Accessibility Layer

## Purpose

ODIN should eventually support voice output to improve accessibility, personality and ease of use.

This is especially valuable for:

* visually impaired users
* dyslexic users
* users with low technical confidence
* users who prefer guided narration
* users working hands-free

---

# Voice Mode

Voice Mode should allow ODIN to read:

* questions
* explanations
* setup steps
* warnings
* errors
* next actions
* summaries

Example:

```text id="b9ocwi"
ODIN asks:

“What would you like to create today?”
```

The same question appears on screen and is spoken aloud.

---

# Hover-to-Speak Mode

As a later accessibility feature, answer options can be spoken when hovered or focused.

This should support:

* mouse hover
* keyboard focus
* touchscreen long press
* screen reader compatibility

Example:

```text id="9kt9c3"
Cursor hovers over:

“I have no technical experience”

ODIN speaks:

“Choose this if you are completely new to building websites or apps.”
```

---

# Accessibility Settings

Users should be able to control:

* voice on/off
* voice speed
* voice volume
* voice style
* hover-to-speak on/off
* reduced motion
* large text
* high contrast
* keyboard navigation
* screen reader friendly mode

---

# Implementation Priority

## MVP

* fully accessible text UI
* keyboard navigation
* semantic HTML
* ARIA labels
* clear contrast
* large tap targets

## Phase 2

* basic text-to-speech for ODIN questions
* replay question button
* mute button

## Phase 3

* hover/focus-to-speak
* voice personality options
* guided setup narration

## Phase 4

* speech input
* conversational accessibility mode
* multilingual voice support

---

# Product Principle

Voice must support accessibility first and personality second.

ODIN should feel helpful, calm and clear — never intrusive.
