# Spin & Choose

SpinPick — Random Choice Wheel

Create a modern, minimal, premium-looking web app called SpinPick.

Core Concept

SpinPick is a simple random-choice wheel website.

Users can:

Enter multiple words or choices.

See those choices automatically appear as sections on a spinning wheel.

Press a large SPIN button to spin the wheel.

Have the wheel randomly land on one choice.

Display the selected choice in a satisfying animated winner popup.

The website should feel calm, smooth, elegant, playful, and premium rather than loud or overly colorful.

Design & Color Palette

Use a baby pink + white aesthetic throughout the website.

Primary colors:

Soft baby pink

Pale blush pink

Very light pink

White

Soft gray for secondary text

Avoid:

Neon colors

Dark themes

Harsh gradients

Excessively saturated colors

Cluttered layouts

Use subtle pink gradients only where they improve the design.

The overall visual style should feel similar to a modern SaaS/productivity website with a soft feminine aesthetic.

Typography

Use a modern clean font such as Inter, Poppins, or DM Sans.

Typography should have:

Large bold headings

Clean readable body text

Rounded modern buttons

Plenty of whitespace

Homepage Layout

Navbar

Create a simple centered/max-width navbar.

Left:
SpinPick logo with a small minimalist wheel icon.

Right:

How It Works

About

Keep the navbar minimal and clean.

Hero Section

Large centered heading:

Spin. Pick. Done.

Subtitle:

Enter your choices, spin the wheel, and let SpinPick make the decision for you.

Below this, create the main wheel application.

Main Wheel Interface

Create a large responsive spinning wheel in the center of the page.

The wheel should:

Have smooth rounded segments

Use different shades of baby/pale pink and white

Display the entered words inside the wheel

Automatically resize text depending on the number of choices

Have a fixed pointer at the top

Include subtle shadows

Have a polished 3D-ish depth effect without looking overly realistic

Place a large rounded button underneath:

SPIN

The button should be baby pink with white text.

Add subtle hover and press animations.

Choice Input Panel

Place a clean card beside or below the wheel depending on screen size.

Title:

Your Choices

Provide an input field:

Enter a word or choice...

with an Add button.

Users should also be able to press Enter to add a choice.

Display added choices as small rounded pills/cards.

Each choice should have:

The word

A small remove × button

Example:

Pizza ×
Burger ×
Biryani ×

Include:

Clear All

button.

Empty State

When there are no choices, show:

Add some choices to get started

and a subtle animated empty wheel illustration.

The SPIN button should be disabled until there are at least 2 choices.

Spin Animation

Make the wheel animation feel extremely smooth and satisfying.

Requirements:

Realistic acceleration

Fast spinning

Gradual deceleration

Smooth final landing

Slight anticipation before spinning

No janky movement

The result must be genuinely random

Ensure the pointer accurately matches the selected segment

Use easing curves and physics-inspired timing.

The wheel should spin for approximately 4–6 seconds.

Add subtle sound effects if possible, with a mute/unmute control.

Winner Animation

When the wheel stops, display a beautiful centered modal/card.

Example:

✨ Your Pick

Biryani

Add a subtle celebration animation such as:

Soft confetti

Floating particles

Gentle scale-in animation

Buttons:

Spin Again

Close

The winner should feel satisfying without becoming visually overwhelming.

Extra Features

Add these small but useful features:

Remove Winner

Toggle:

Remove winner after spin

When enabled, the selected choice is automatically removed from the wheel after the result.

Spin History

Show a small collapsible section:

Spin History

Display previous results with timestamps or simple numbered history.

Example:

Biryani

Pizza

Movie

Burger

Include a clear history button.

Keyboard Support

Allow the user to press:

Spacebar → Spin

Responsive Design

The website must work beautifully on:

Desktop

Laptop

Tablet

Mobile

On mobile, stack the wheel above the choices panel.

Make the wheel large enough to be enjoyable on mobile without causing horizontal scrolling.

Animations

Animations are extremely important.

Use calm, subtle, smooth animations throughout the website.

Examples:

Soft fade-ins

Gentle slide-ups

Button hover scaling

Smooth card transitions

Choice pill animations when added/removed

Smooth modal appearance

Subtle background floating shapes

Smooth wheel rotation

Avoid excessive animations.

Everything should feel buttery smooth and premium.

Background

Use a mostly white background with extremely subtle pale-pink decorative elements.

Possible elements:

Very faint pink blobs

Soft blurred circles

Subtle gradient glow behind the wheel

Keep the background clean.

Footer

At the bottom:

Made by noahxd

Make noahxd slightly emphasized but still subtle.

Do not add any other credits.

UX Requirements

The website should feel extremely easy to understand without instructions.

A first-time visitor should immediately understand:

Add choices → Spin → Get your pick

Make buttons obvious and interactions satisfying.

Technical Requirements

Build this as a polished production-ready frontend.

Use:

React

TypeScript

Tailwind CSS

Modern component architecture

Responsive design

Local storage for saving the current wheel and spin history

Do not require authentication.

Do not require a backend.

All wheel functionality should work entirely in the browser.

Make the random selection fair and ensure the visual wheel landing corresponds exactly to the selected result.

Overall Feel

The final website should feel like:

Apple-level simplicity + modern SaaS UI + soft baby-pink aesthetic + satisfying micro-interactions.

Keep everything clean, spacious, smooth and premium.

The main focus should always be the spinning wheel.

Do not overcomplicate the interface.

The finished product should look like a real polished product called SpinPick, not a basic coding project.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7693f74c-a8ae-463a-8fbf-997e91277593).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
