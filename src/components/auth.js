"use client";

import styles from "./Page.module.css";

import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React, { useState } from "react";
import { auth, googleProvider } from "../config/firebase-config";

export const Auth = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
                integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
                crossorigin="anonymous"
            />
            <div className={`${styles["flex"]}`}>
                <input 
                    className={` ${["form-control"]} ${styles["form"]}  `}
                    placeholder="Email..."
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className={` ${["form-control"]} ${styles["form"]}  `}
                    placeholder="Password..."
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className={` ${["btn"]} ${["btn-dark"]} `} onClick={ signIn }>Sign In</button>
        
            <button className={` ${["btn"]} ${["btn-dark"]} ${styles["middle"]} `} onClick={ signInWithGoogle }>Sign in With Google</button>

            <button className={` ${["btn"]} ${["btn-dark"]} `} onClick={ logOut }>Logout</button>

            <hr/>
        
        </div>
    );
};