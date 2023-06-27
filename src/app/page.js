"use client";

import React, { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes } from "firebase/storage";
import styles from "./Page.module.css";
import { Auth } from "../components/auth";
import { db, auth, storage } from '../config/firebase-config';

function App() {
  const [movieList, setMovieList] = useState([]);
  const [fileUpload, setFileUpload] = useState("");
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const moviesCollectionRef = collection(db, "movies");
  const [updatedTitle, setUpdatedTitle] = useState("");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    setUpdatedTitle("");
    getMovieList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={`${styles["body"]}`}>
      <p>{isLoggedIn ? "You are logged in" : "You are not logged in"}</p>

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossorigin="anonymous"
      />
      <Auth />

      <div>
        <div className={`${styles["flex"]}`}>
          <input
            className={` ${["form-control"]} ${styles["form"]}  `}
            placeholder="Movie title...."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
          <input
            className={` ${["form-control"]} ${styles["form"]}  `}
            placeholder="Release date...."
            type="number"
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />
        </div>

        <input
          className={` ${["form-check-input"]} `}
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setisNewMovieOscar(e.target.checked)}
        />

        <label className={` ${styles["middle"]} `}>Received an Oscar</label>
        <button className={` ${["btn"]} ${["btn-dark"]} `} onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <hr/>

      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>

            <div className={`${styles["flex"]}`}>

              <button className={` ${["btn"]} ${["btn-dark"]} `} onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

              <input
                className={` ${["form-control"]} ${styles["form"]}  `}
                placeholder="New title..."
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
              <button className={` ${["btn"]} ${["btn-dark"]} `} onClick={() => updateMovieTitle(movie.id)}>{" "}Update Title</button>
            </div>
          </div>
        ))}
      </div>

      <hr />

      <div className={`${styles["flex"]}`}>
        <input className={` ${["form-control"]} ${styles["form"]}  `} type="file" onChange={(e) => setFileUpload(e.target.files[0])}/>
        <button className={` ${["btn"]} ${["btn-dark"]} `} onClick={ uploadFile }>Upload File</button>
      </div>

    </div>
  );
}

export default App;
