import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/firebase";
import { collection, addDoc, getDocs, query, orderBy, Timestamp, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";

// Define the Booking interface
interface Booking {
  id: string;
  username: string;
  userId: string;
  carId: string;
  price: number;
  totalPrice: number;
  carName: string;
  carImage: string;
  carType: string;
  status: boolean;
  toDate: string;
  fromDate: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Define the state structure
interface BookingState {
  bookings: Booking[];
  loading: boolean;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
};

// Thunk to fetch all bookings
export const fetchBookings = createAsyncThunk("bookings/fetchBookings", async () => {
  try {
    const bookingCollection = collection(db, "booking");
    const bookingQuery = query(bookingCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(bookingQuery);
    console.log("Fetched Booking:", snapshot.docs.map((doc) => doc.data())); // Debug log

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
});


export const fetchBookingsById = createAsyncThunk(
  "bookings/fetchBookingsById",
  async (userId: string) => {
    try {
      const bookingCollection = collection(db, "booking");
      const bookingQuery = query(bookingCollection, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(bookingQuery);

      // console.log(
      //   "Fetched Booking:",
      //   snapshot.docs.map((doc) => doc.data()) 
      // );

      const filteredBookings = snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return data.userId === userId; // Ensure userId exists and matches
        })
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];

      return filteredBookings;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw new Error("Failed to fetch bookings");
    }
  }
);

// Thunk to add a booking
export const addBooking = createAsyncThunk(
  "bookings/addBooking",
  async (
    {
      username,
      userId,
      carId,
      price,
      totalPrice,
      carName,
      carImage,
      carType,
      status,
      toDate,
      fromDate,
    }: {
      username: string;
      userId: string;
      carId: string;
      price: number;
      totalPrice: number;
      carName: string;
      carImage: string;
      carType: string;
      status: boolean;
      toDate: string;
      fromDate: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Fetch the car document
      const carRef = doc(db, "cars", carId);
      const carSnapshot = await getDoc(carRef);

      // Check if the car exists
      if (!carSnapshot.exists()) {
        console.error("Car document does not exist.");
        return rejectWithValue("Car not found.");
      }

      const carData = carSnapshot.data();
      console.log("Car Data:", carData);

      // Validate car status
      if (!carData.status) {
        console.error("Car is already booked.");
        return rejectWithValue("Car is already booked.");
      }

      // Proceed with the booking
      const bookingRef = collection(db, "booking");
      const bookingData = {
        username,
        userId,
        carId,
        price,
        totalPrice,
        carName,
        carImage,
        carType,
        status: false, // Mark car as booked
        fromDate,
        toDate,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      console.log("Booking Data:", bookingData);

      // Add the booking to Firestore
      const docRef = await addDoc(bookingRef, bookingData);

      // Update the car's status
      await updateDoc(carRef, { status: false });

      return { id: docRef.id, ...bookingData };
    } catch (error: any) {
      console.error("Error during booking:", error.message);
      return rejectWithValue(error.message || "Failed to add booking");
    }
  }
);




// Thunk to delete a booking
export const deleteBooking = createAsyncThunk("bookings/deleteBooking", async (id: string) => {
  try {
    const bookingRef = doc(db, "booking", id);
    await deleteDoc(bookingRef);
    return id;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking");
  }
});

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookings.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchBookingsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingsById.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookingsById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addBooking.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteBooking.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default bookingSlice.reducer;