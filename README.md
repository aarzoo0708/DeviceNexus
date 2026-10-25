# DeviceNexus

A college project for managing customers, devices, service requests, warranties,
interactions, and follow-ups. Built with React, JSX, React Router, Redux Toolkit,
Context, Tailwind CSS v4, and CSS Modules. Data is saved in browser localStorage.

## Run the project

```sh
cd frontend
npm install
npm run dev
```

Other commands: `npm run lint` checks code; `npm run build` creates the production build.

## Start reading here

Read these files in this order:

1. `frontend/src/main.jsx` starts React and connects Redux, the theme, and the user.
2. `frontend/src/router.jsx` lists every URL and its page.
3. `frontend/src/components/layout/AppLayout.jsx` shows the sidebar, navbar, and current page.
4. `frontend/src/pages/Customers.jsx` is a small example of a complete page.
5. `frontend/src/pages/AddCustomer.jsx` shows form state, validation, and saving.
6. `frontend/src/store/slices/customersSlice.js` shows how Redux changes a record.
7. `frontend/src/store/store.js` connects the slices and saves changes to localStorage.

There is one entry point (`main.jsx`). Pages are loaded through the router.

## Where to find things

| Want to change... | Look in... |
| --- | --- |
| A page's display, search, filters, or modal state | `frontend/src/pages/` |
| Customer form or customer table columns | `frontend/src/components/customers/` |
| Device forms and details | `frontend/src/components/devices/` |
| Service forms, statuses, and table columns | `frontend/src/components/serviceRequests/` |
| Warranty forms, date calculations, and table columns | `frontend/src/components/warranty/` |
| Interaction forms and details | `frontend/src/components/interactions/` |
| Follow-up forms, details, and filters | `frontend/src/components/followUps/` |
| Dashboard widgets | `frontend/src/components/dashboard/` |
| Shared buttons, badges, cards, tables, and search | `frontend/src/components/common/` |
| Sidebar and navbar layout | `frontend/src/components/layout/` |
| Colors, spacing defaults, and shared form styles | `frontend/src/index.css` |
| How a record is added, edited, or reset | `frontend/src/store/slices/` |
| Shared Regex and length checks | `frontend/src/utils/validation.js` |
| Initial demo records | `frontend/src/data/initialData.js` |
| Theme preference | `frontend/src/contexts/ThemeContext.jsx` |
| Demo user and profile | `frontend/src/contexts/AuthContext.jsx` |

## How a save works

Example: adding a customer.

1. `AddCustomer.jsx` keeps typed values in `useState`.
2. `CustomerForm.jsx` displays the fields and calls the supplied handlers.
3. The page checks required values and dispatches `addCustomer(newCustomer)`.
4. `customersSlice.js` adds the record to Redux.
5. `store.js` automatically saves Redux data to localStorage.
6. Pages using `useSelector` display the updated records.

**useState** is for temporary page state: search text, form values, open dialogs.
**Redux** is for shared business records: customers, devices, tickets, etc.
**Context** is for the active demo user and theme.
**localStorage** keeps saved data after a refresh. There is no backend.

## Small shared CSS classes

Repeated Tailwind declarations are named in `index.css`:

- `panel`: the standard card surface, border, and rounded corners.
- `form-control`: the standard input/select/textarea style.
- `field-label`: the standard label style.
- `modal-backdrop`: the full-screen dialog background and placement.
- `ui-clickable`: hover/focus feedback for clickable rows and cards.

Pages still use Tailwind for their own grids, padding, gaps, and responsive layout.
Keep global defaults inside `@layer base`; an unlayered universal padding reset can
override Tailwind spacing.

## Dashboard shortcuts

These URLs open a filter or a specific detail dialog:

- `/service-requests?status=Resolved`
- `/service-requests?request=REQ-1024`
- `/warranty?policy=WAR-501`
- `/interactions?interaction=INT-1001`
- `/follow-ups?followUp=FLP-201`

## Editing safely

Change the page or feature component first. Reuse the common components and shared
CSS instead of copying long style strings. Keep record IDs, relationships, and
localStorage keys consistent. Run lint/build, then check the affected page in the browser.

Dark Mode is the default; saved preferences are respected. Reset Demo Data is in Settings.
