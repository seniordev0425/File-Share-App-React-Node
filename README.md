# Fast.io React Front End

## Steps to run the app in the development mode or build for production

1. Open the terminal, go to the project directory.
1. Run `npm install` or `yarn` to install node module dependencies into `node_modules` directory.
1. Copy `.env.example` to `.env` in the project directory and change configuration values as needed.
1. Run `npm start` or `yarn start` to run the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. If default port 3000 is already used by another app, unused port will be automatically assigned for the app. The page will reload if you make edits and you will also see any lint errors in the console.
1. (After step 3) On terminal `npm test` or `yarn test` to launch the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
1. (After step 3) run `npm run build` or `yarn build` to generate production build for deployment into the `build` directory.<br>
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Project structure

This project uses typical React project structure where `src` directory houses subdirectories determined by the type of files to put into, e.g. `components`, `store`, `routes`, `utils`, etc.

- JS files directly under the `src` directory are used for bootstrapping front end or unit test.
- Normal React project puts components directly under `components`. But we use one more level here - we group components by their route. For example, `components/account` houses all the components used in `/account/...` routes. There are also `components/common` and `components/layout` that doesn't belong to one specific route and used in anywhere as needed instead.
- `store` directory contains all store reducers, sagas, constants, model definitions, etc.
- Project uses route-based code-splitting where level 1 sub routes will have separate chunk. For example, `/account/...` routes and `/sites/...` routes will have load different chunk when entering. This route-based code-splitting is done in `routes` directory where `routes/index.js` is the main entrypoint and other files are sub-routes loaded in `index.js`.
- If necessary, component-based code-splitting can be applied to any app to separate chunks even further. This could be useful when there are some big components which will not be used until some specific conditions are met, e.g. if user arrives at a specific page or open a toggle/tab/modal. General consensus is that apply code-splitting to components that users may not access frequently, e.g. Settings page.
- Unit test files are at the same place of tested code files. Test files use the same file name but with `.test` postfix to the filename, e.g. `validation.test.js` is the unit test file for `validation.js` in the same directory.

## App Data Persistence for Immutable-based Redux Store

Currently `redux-persist` v4 and `redux-persist-immutable` v4 packages are used to persist immutable-based store data to browser storage. API endpoints are only called when required data is missing and redux store persists loaded data unless server tells that data is expired using `Poll` API.

### Registering added immutable record model

Note: because we're defining data models using `Record` we need a bit of additional work when we're defining a new model into store.

Steps needed when adding model (also applies when adding a reducer with models):

1. When defining a new model, specify its name into second parameter of `Record` constructor. For example:
   ```javascript
   export const MyData = Record({
     field1: '',
     field2: 0,
   }, 'MyData')
   ```
   Note that reducer state records don't need name because they're transformed into `Map` before persisting in field filtering transform.

1. Import defined record into `src/store/common/immutableTransform.js` and add it to `records` array in the parameter of call to `immutableTransform`. Note that import name should be exactly the same as its defined record name(second parameter given to `Record` constructor.)

Steps needed when adding a reducer:

1. Import these into new reducer file.
   ```javascript
   import { createPersistenceHandlers } from 'store/persist'
   ```

1. Add an entry for rehydrate handler to reducer map for `handleActions`. First parameter should be the name of that store reducer, and second should be record type of state of the reducer.
   ```javascript
   export const reducer = handleActions({
     ...

     /* Data caching and persistence */

     ...createPersistenceHandlers('billing'),
   })
   ```

1. Add the name of the reducer to cache map defined in `src/store/persist/cache.js`. Each entry in this map should have reducer name as key and corresponding server data object name as value.

### Filtering fields from persisting in reducers

1. Add a constant for defining array of blacklisted field names. Notable examples to blacklist are create/update/delete API states.

   For example in `src/store/modules/auth/models.js`:
   ```javascript
   export const blacklistedFields = [
     'loginState',
     'createKeyState',
     'deleteKeyState',
   ]
   ```

1. Import into `src/store/persist/fieldFilterTransform.js` and add as an entry into `blacklistFieldsMap`.
   ```javascript
   ...

   import { blacklistedFields as authBlacklistedFields } from 'store/modules/auth/models'

   ...

   const blacklistFieldsMap = {
     ...
     auth: authBlacklistedFields,
     ...
   }
   ```
