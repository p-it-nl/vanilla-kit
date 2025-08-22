# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- Testing setup (unit & integration)  
- router - multi-segment routing support  
- router - improvements (wildcard matching, route guards, passing data)  
- More documentation and examples  
- binder - Support for array/repeated templates (e.g., `for`-like binding) in Binder  
- binder - Optional value formatters or transformers for bound data (e.g., uppercase, currency)

## [1.0.2] - 2025-08-22

- Added `Binder` class for two-way data binding between objects and DOM elements  
- Introduced `bind="key"` attribute for declarative binding in templates  
- Support for text, input `value`, and `contentEditable` fields  
- Integrated double-click editing UX with automatic commit on blur or click-away    
- Separated HTML editing logic into reusable helper (`makeEditable`)  
- Improved lifecycle handling: Binder now initialized after template load  
- Updated documentation to reflect new data binding and editable element features

## [1.0.1] - 2025-08-16

- Added lightweight client-side router (hash-based) for SPA-style navigation  
- Improved README and documentation, including router usage  
- Updated build scripts with clearer dev/prod mode handling  
- Minor cleanup and refinements in code and structure  

## [1.0.0] - 2025-08-08

- First official release of VanillaKit
