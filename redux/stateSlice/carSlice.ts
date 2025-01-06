import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/firebase"; 
import { collection, addDoc, getDocs, query, orderBy, Timestamp,updateDoc , deleteDoc, doc } from "firebase/firestore";
import { error } from "console";

interface Car {
  id: string;
  name: string;
  price: number;
  carImage: string;
  type: string;
  status: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface CarState {
  cars: Car[];
  loading: boolean;
}

const initialState: CarState = {
  cars: [],
  loading: false,
};

export const fetchCars = createAsyncThunk("cars/fetchCars", async () => {
    const carsCollection = collection(db, "cars");
    const carsSnapshot = await getDocs(carsCollection);
    console.log("Fetched Cars:", carsSnapshot.docs.map((doc) => doc.data())); // Debug log
    return carsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Car[];
  });
  

// Thunk to add a car
export const addCar = createAsyncThunk(
  "cars/addCar",
  async ({ name, price, carImage,type, status }: { name: string;type:string, price: number; carImage: File; status: boolean }) => {
    const base64Image = await convertToBase64(carImage);
    const carsRef = collection(db, "cars");
    await addDoc(carsRef, {
      name,
      price,
      carImage: base64Image,
      status,
      type,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }).then((res)=>console.log('res' , res)).catch((err)=>console.log("err",err));

    return { name, price, carImage: base64Image, status , type};
  }
);


export const updateCar = createAsyncThunk(
    "cars/updateCar",
    async ({ id, name, price, carImage,type, status }: { id: string; name: string; price: number; carImage?: File | null; status: boolean }) => {
      console.log("up-hndl" , id, name, price, carImage,type, status)
        const carRef = doc(db, "cars", id);
      const updatedData: any = {
        name,
        price,
        status,
        type,
        updatedAt: Timestamp.now(),
      };
  
      if (carImage?.name) {
        const base64Image = await convertToBase64(carImage);
        updatedData.carImage = base64Image;
    }else(
          updatedData.carImage = carImage
      )
  
      await updateDoc(carRef, updatedData);
  
      return { id, ...updatedData };
    }
  );
  


export const deleteCar = createAsyncThunk(
    "cars/deleteCar",
    async (id: string) => {
        // console.log('dl-hn' , id)
      const carRef = doc(db, "cars", id);
      await deleteDoc(carRef).then((res)=>console.log('dlt-res' ,res)).catch((error)=>console.log('dlt-err',error));
      return id;
    }
  );

// Convert image to base64
const convertToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.cars = action.payload;
        state.loading = false;
      })
      .addCase(fetchCars.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addCar.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.cars.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addCar.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCar.pending, (state, action) => {
        state.loading = true;
    })
    .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex((car) => car.id === action.payload.id);
        if (index !== -1) {
            state.cars[index] = { ...action.payload };
        }
        state.loading = false;
        })
        .addCase(updateCar.rejected, (state, action) => {
          state.loading = false;
        })
        .addCase(deleteCar.pending, (state, action) => {
          state.loading = true;
        })
        .addCase(deleteCar.fulfilled, (state, action) => {
            state.cars = state.cars.filter((car) => car.id !== action.payload);
            state.loading = false;
        })
        .addCase(deleteCar.rejected, (state, action) => {
          state.loading = false;
        });
  },
});

export default carSlice.reducer;
