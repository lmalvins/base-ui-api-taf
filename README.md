# base-ui-api-taf

## Prerequisites

To work with this project, you need to have `Node.js` and `Yarn` installed. When this project was created, it was developed using:

- **Node.js v20.17.0** (LTS)
- **Yarn v4.5.0**

We recommend using [Volta](https://volta.sh) for managing these dependencies. Volta is a hassle-free tool for managing `Node.js` versions and associated tools like `Yarn` or `npm`, ensuring consistent versions across your development environment.

> **Note:** If you already have the correct versions of `Node.js` and `Yarn` installed, you can skip to the [Project Setup](#project-setup) section below.

### Why Volta?

- Automatically switches to the correct `Node.js` and `Yarn` versions based on the project configuration.
- Easy to install and configure.
- Cross-platform support for Windows, macOS, and Linux.

### Installing Volta

To install `Volta`, open your terminal and run:

```bash
curl https://get.volta.sh | bash
```

After installing Volta, you may need to restart your terminal or run the following command to add Volta to your path (if not automatically added):

```bash
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```

Verifying Your Installation
To verify your installation, run:
```bash
node -v
yarn -v
```

## Project Setup
### Export API Credentials
Before proceeding, make sure you export the required API credentials for testing. These credentials are the credentilas provided by you, necessary for token generation. You need to set the following environment variables in your terminal:

```bash
export USER_ID="your_user_id"
export USER_SECRET="your_user_secret"
```
and replace `your_user_id` and `your_user_secret` with the actual credentials provided to you.

## Installing Project Dependencies
Once the API credentials are set up, install the project dependencies by running:

```bash 
yarn install
```
This will install all project dependencies as specified in the `package.json` file.

## Running Tests
The project includes a suite of both API and UI tests. Use the following commands to run the tests:
- **Run all tests (API + UI):**
```bash 
yarn test
```
- **Run API tests:**
```bash 
yarn test-api
```
- **Run UI tests:**
```bash 
yarn test-ui
```

After the test execution is completed, Playwright will automatically open the test report in your default browser. If the report does not open automatically, you will see the report URL at the end of the console output. You can manually open this URL in your browser to view the detailed test results. 
Videos and trace data will only be generated and included in the report for failed tests. This approach helps reduce unnecessary data and keeps the report concise for successful test runs.

## Running Linters and Formaters
This project uses ESLint for linting basic code rules and Prettier for formatting.
- **To format the code using Prettier, run:**
```bash 
yarn format
```
- **To lint the code using ESLint, run:**
```bash 
yarn lint
```

# Approach for UI Testing

## Overview
To have better organization, the project follows the **Page Object Model (POM)** structure. This helps in separating test logic from UI actions, making the test automation framework easier to maintain and extend.

- The `src` folder contains a ui folder to separate from the api stuff, it contains the `page-objects` directory, where pages and components are located.
- The `tests` folder also includes a separate `ui` directory dedicated to test ui specification files only.

## Page Organization and Component Breakdown
An initial test run was conducted to familiarize with the application and its elements. Based on the findings, and together with the requirements, the main pages and components were identified, and the corresponding elements were extracted.

### Organization Structure:
- **Home Page**: Defined as `home-page.ts`.
- **Plans Page**: Defined as `plans-page.ts`, containing a `plan-details` component.
  - The `plan-details` component belongs to the `plans-page`. 
  - Even though the URL changes when this component is active, it is categorized as a component rather than a page because other plans are still accessible in the DOM. This indicates a modular structure, where the component is a container within the parent page.

## Test File Structure
The test structure is set up using `search-spec.ts` file to describe the main functionalities to be tested.
- A main `test.describe` With a high level test description.
- A `test.beforeEach` to handle common prerequisites such as **cookie acceptance** and **notification handling**.
- A `test` for the specific plan to check with its respectives `test.step`.
    - A step to **Search for a Specific Country**.
    - A step to **Navigate to the First eSIM Plan**.
    - A final step to **Verify Plan Details** according to the requirements in the provided document.

## Parallel executions
The test autmation framework is configured to run in full parallelization in the `playwright.config.js` file, so the tests needed to be designed also taking that into consideration. For the UI part it is enough avoiding common variables at a higher test.describe level, encapsulating the requiered object on each test definition.

## Assertion Strategy
Given the multiple elements to validate, a **soft assertion strategy** is used to validate them without stopping the execution on the first failure.

## Locator Strategy
1. **Primary Approach**: I used Playwright's built-in locator methods `getByTestId`, leveraging the presence of `data-testid` attributes in almost all the elements.
2. **Fallback Strategy**: I used IDs when `data-testid` was not present.
3. **Last Resort**: I used class-based selectors when neither of the above options was feasible.

# Approach for API Testing
## Overview
The `src` folder contains a `api` folder to separate from the `ui` stuff,  it contains the `api-objects` folder, the `fixtures` folder and the `api-client.ts` file.
- Subfolder:
  - **`api-objects` folder**: is an **abstraction layer** that helps organize requests to different endpoints in a microservice or monolith architecture. This structure follows some principles as the **Page Object Model (POM)** used in UI testing.
  - **`fixtures` folder**: Contains all the fixtures required by the tests.
  - **`api-client.ts` file**: Contains the primitive HTTP methods (`GET`, `POST`, etc.) required for this particular testing process.

## API Object Model
The `api-objects` approach introduce an **abstraction layer** that helps organize requests to different endpoints in a microservice or monolith architecture. This structure follows some principles as the **Page Object Model (POM)** used in UI testing.

## Key Components:
- **`api/api-objects/airalo-service.ts`**: Following the API Objects principle mentioned above, for this service, all the necessary requests, urls, paths for this particular service are defined within this class.
  This service class implements a the `api/api-client.ts` for all its requests.
- **`api/api-client.ts`**: it is another abstraction layer that contains the primitive HTTP methods (`GET`, `POST`, etc.) required for this particular testing process.
- **`api/fixtures/base-api-test-fixture.ts`**: This fixture helps on authenticating and generating the oauth token for every tests, it extedns the `test` functionality, avoiding steps like `test.beforeEach`.
  
### Advantages of Using These Abstraction Layers
1. **Code Reusability**: Common API methods (like GET, POST, DELETE) can be reused across multiple service classes, reducing duplication.
2. **Improved Maintenance**: Changes to the HTTP request logic only need to be made in the base `APIClient` rather than in every service class.
3. **Modularity**: Organizing endpoints into service classes helps maintain a clean separation between different parts of the API.
4. **Scalability**: Adding new endpoints or services becomes easier due to the structured approach.

### Spec File Structure
The specification file for API tests is similar to the one used for UI testing, but it has some specific configurations for handling API interactions.

- A main `test` for orders/esims creation/verification wich is extending from `the base-api-test-fixture.ts` fixture, it receives the `airaloService` and `token` from the fixture.
   - A step to **Place Order**: Executes a POST request to create an order.
   - A step to **Verify Placed Order**: Ensures that the order meets the expected criteria.
   - A step to **Verify eSIMs Creation**: Checks that the eSIMs are correctly generated.

### Testing Approach Modification
According to the provided requirements, the original plan was to:

1. Create the order using the `/orders` endpoint.
2. List created eSIMs using the `/esims` endpoint.

**Modified Approach**:
- Instead of listing eSIMs directly from the `/sims` endpoint after creating the order, the following sequence was used:
  1. **Place the order** using the `/orders` endpoint.
  2. **Check the order** using the `/orders/:id` endpoint to ensure it was created with the specific requirements.
  3. **Retrieve eSIMs one by one** from the placed order, from the `sims` array when doing `GET` `/orders/:id`.
  4. **Assert Details** on each individual eSIM linked to the order using the iccid and the `/sims/:iccd` endpoint, in order to confirm that the details match the original order.

This approach guarantees a robust validation of the connection between the order and the eSIMs, ensuring data consistency across different endpoints.
