# Daily Planner

A personal productivity web app for planning study hours, crochet time, tasks
and internship applications. It runs in the browser and works on phones.

**Live demo:** https://personal-productivity-planner-one.vercel.app

## Why I built it

I wanted one place to plan my days around lectures: 4 hours of study outside
class, 1 hour of crochet every day, tasks for university, my career and my small
crochet business, plus a tracker for internship applications.

## Features

- **Dashboard:** today's study and crochet progress, a weekly study chart, task
  progress by category and internship counts
- **Daily Plan:** a 4-hour study goal, a 1-hour crochet goal and a focus timer
- **Tasks:** University, Career and Shizelle categories, search, sorting, editing
  and undo for deleted tasks
- **Weekly Planner:** a Monday to Sunday view, with tasks you can drag to another day
- **Internship tracker:** companies, roles, notes and status (Applied, Interview,
  Offer, Rejected)
- **Backup and restore:** download all data as a file and restore it later
- **Responsive design:** a mobile menu and large tap targets
- **Small touches:** animated progress bars, a celebration when a daily goal is
  reached, and the keyboard shortcut `N` to add a task

## Tech stack

- React and Vite
- React Router
- Plain CSS with CSS variables (dusty rose, ash and cream palette)
- Browser LocalStorage for saving data
- Deployed on Vercel

## How data is stored

Everything is saved in your browser's LocalStorage. There is no account and
nothing is sent to a server, so data stays on one browser on one device. Use
**Download backup** on the Dashboard to move your data to another device.

## Screenshots

<img width="1906" height="857" alt="Screenshot 2026-10-29 234304" src="https://github.com/user-attachments/assets/e2f18b1f-2350-40b7-85d2-23275c35cbfd" />
<img width="1896" height="862" alt="Screenshot 2026-10-29 234346" src="https://github.com/user-attachments/assets/e92a807e-205f-454a-96e5-87712f4dd85e" />
<img width="1917" height="851" alt="image" src="https://github.com/user-attachments/assets/ea3fcb49-b60d-4f39-bfef-b83a8d26cf64" />
<img width="1916" height="861" alt="Screenshot 2026-10-29 234420" src="https://github.com/user-attachments/assets/e9c1a205-87fe-4645-884c-ea84554e910e" />
<img width="1917" height="850" alt="Screenshot 2026-10-29 234431" src="https://github.com/user-attachments/assets/5be304de-cea5-42d0-b029-93169215a141" />
<img width="1917" height="851" alt="Screenshot 2026-10-29 234445" src="https://github.com/user-attachments/assets/fb004df1-3341-4d92-a81e-2c39336c0173" />
