# Headless Form JS SDK (beta release)

This is a JS SDK package that helps render a form based on metadata taken from the Headless Form API. In this package, there are 2 main parts:

| Project                         | Description             |
| --------------------------------| ------------------------|
| @episerver/forms-sdk           | JS SDK for models, client validation, form loader, form dependencies, form submit |
| @episerver/forms-react         | React SDK for rendering a form as a React component |

ref: https://docs.developers.optimizely.com/content-management-system/v1.2.0-forms/docs/get-started-with-headless-optimizely-forms
## Getting Started

### Installation
**From Azure Artifacts** 

Source https://dev.azure.com/EpiserverEngineering/netCore/_artifacts/feed/headless_forms_beta

To use packages from Azure Artifacts, configure your project to reference this feed. Create a new text file called .npmrc in the same directory as your package.json, then copy the snippet below.
```
   @episerver:registry=https://pkgs.dev.azure.com/EpiserverEngineering/netCore/_packaging/headless_forms_beta/npm/registry/
```
Install from the command line
```
   $ npm install @episerver/forms-sdk@0.1.0
```
```
   $ npm install @episerver/forms-react@0.1.0
```

**OR** clone source code and install dependencies, then build and view the site on the browser.

1. Clone repo

```sh
   git clone https://github.com/episerver/content-headless-form-js-sdk.git
```
```sh
   cd content-headless-form-js-sdk
```

2. Install package dependencies and database

```sh
   npm run setup
```

3. Build all projects

```sh
   npm run build
```

4. Run unit tests

```sh
   npm run test
```

5. Start management site

```sh
   npm run start-backend
```

6. Start react site

```sh
   npm run start-frontend
```

### View site on browser

Access management site with credentials:

|Name    |Password   
|--------|------------|
|cmsadmin|sparr0wHawk! 
|emil    |sparr0wHawk! 
|ida     |sparr0wHawk! 
|alfred  |sparr0wHawk! 
|lina    |sparr0wHawk!

Create a form with some elements in MainContentArea of Start page.

1. Management page

```sh
   http://localhost:8082/episerver/cms
```

2. React page

```sh
   http://localhost:3000/
```
