# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 25-02-2026

- Testing - setup for unit testing  
- Testing - setup for integration testing  
- Router - multi-segment routing support and improvements: wildcard matching and passing data
- Router - change made to enforce only one instance of router
- Router - add mutation observer for objects that are dynamically added and have a navigation attribute
- Binder - Optional value formatters or transformers for checkbox, radio, select, multiselect, date and arrays
- Evaluator - allows show-if and class-if conditional attributes
- Animation - basic animation added (linear)
- General - add HTML loader that caches already loaded HTML
- General - indication for element loading and loaded
- General - improve component integration
- General - add structure indication to components to show best practises (e.g. ondisconnected callback) 
- General - more documentation and examples
- Demo - reworked starter page to a full fledge webshop demo showing the power of VanillaKit
- Data - first implementation of data exchange including retrieving additional information on actie (e.g. opening select) and web service interaction
- Environment - allow environment configuration more
- Environment - optimize build 
- Environment - add example pipeline script for reference (usable in Jenkins but can also be used manualy or transformed easely for any other CI/CD options)
- Example - add project board example

## [1.0.2] - 22-08-2025

- Added `Binder` class for two-way data binding between objects and DOM elements  
- Introduced `bind="key"` attribute for declarative binding in templates  
- Support for text, input `value`, and `contentEditable` fields  
- Integrated double-click editing UX with automatic commit on blur or click-away    
- Separated HTML editing logic into reusable helper (`makeEditable`)  
- Improved lifecycle handling: Binder now initialized after template load  
- Updated documentation to reflect new data binding and editable element features

## [1.0.1] - 16-08-2025

- Added lightweight client-side router (hash-based) for SPA-style navigation  
- Improved README and documentation, including router usage  
- Updated build scripts with clearer dev/prod mode handling  
- Minor cleanup and refinements in code and structure  

## [1.0.0] - 08-08-2025

- First official release of VanillaKit
