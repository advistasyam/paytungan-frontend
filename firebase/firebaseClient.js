import { initializeApp, getApp, getApps } from "firebase/app"

let app

const firebaseConfig = process.env.FIREBASE_KEY

if (getApps().length) {
  app = getApp()
} else {
  app = initializeApp(firebaseConfig)
}

export { app }
