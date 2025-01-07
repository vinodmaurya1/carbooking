import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  
  apiKey: "AIzaSyCeke58PZ5h4OlUXTa9yM8tbnrJWcBMDQY",
  authDomain: "car-book-15444.firebaseapp.com",
  projectId: "car-book-15444",
  storageBucket: "car-book-15444.firebasestorage.app",
  messagingSenderId: "567547828124",
  appId: "1:567547828124:web:597de48ec989dc35be1a59",
  measurementId: "G-DV1WCBQNXB",
  
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const storage = getStorage();

if (db) {
  console.log("Firestore initialized successfully.");
} else {
  console.error("Failed to initialize Firestore.");
}

const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

// Sign Up with Email and Password
export const signUpWithEmailPassword = async (
  email,
  password,
  name,
  profileImage,
  role
) => {
  const base64Image = await convertToBase64(profileImage);
  // console.log("in firebase", email, password, name, base64Image);
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  // console.log("user create::", userCredential.user);
  const user = userCredential.user;

  // console.log("User UID:", user.uid);
  if (!user.uid) {
    console.error("User is not authenticated. Cannot write to Firestore.");
  }

  try {
    // console.log("Attempting to write to Firestore...");
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name,
      email: user.email,
      profilePicture: base64Image,
      role: role,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    // console.log("Write to Firestore successful.");
  } catch (error) {
    console.error("Write to Firestore failed:", error.code, error.message);
  }
  return user;
};

export const signUpWithGoogle = async (role) => {
  try {
    const users = await getAllUsers();
    const adminUsers = users.filter((user) => user?.role === "admin");

    if (role === "admin" && adminUsers.length > 0) {
      throw new Error("Admin already registered");
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("user-google", user);

    const existUserData = users.filter((data) => data?.email === user.email);
console.log(user.email ,existUserData)
    if (existUserData.length === 0) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        role: role,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    return user;
  } catch (error) {
    console.error("Google sign-up error:", error.message);
    throw error;
  }
};

export const loginWithEmailPassword = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      role: doc.role,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    throw error;
  }
};

export const getUserByUID = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.data();
      // console.log("User data for UID:", uid, userData);
      return userData;
    } else {
      console.error("No user found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by UID:", error.message);
    throw error;
  }
};

export const addCar = async (name, price, carImage, status) => {
  try {
    const base64Image = await convertToBase64(carImage);
    const carsRef = doc(db, "cars", user.uid);
    await setDoc(carsRef, {
      name: name,
      price: price,
      carImage: base64Image,
      status: status,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    // console.log("Write to Firestore successful.");
  } catch (error) {
    console.error("Write to Firestore failed:", error.code, error.message);
  }
};
