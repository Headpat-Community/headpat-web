"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  useEffect(() => {
    const jwt = getCookie("jwt");
    if (jwt) {
      window.location.href = "/account";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOMAIN_API_KEY}`,
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });
      const data = await response.json();

      if (response.status === 400) {
        setError(
          `Incorrect credentials or already made account! We tried everything, It's just not possible.`
        );
        setTimeout(() => {
          setError("");
        }, 5000);
      } else if (response.status === 429) {
        setError("Too many requests!");
        setTimeout(() => {
          setError("");
        }, 5000);
      } else if (response.status === 500) {
        setError("Server error!");
        setTimeout(() => {
          setError("");
        }, 5000);
      } else if (response.status === 200) {
        try {
          const userDataResponse = await fetch("/api/user/createUserData", {
            method: "POST",
            body: JSON.stringify({
              data: {
                status: "Ich bin neu hier!",
                users_permissions_user: data.user.id,
              },
            }),
          });
          if (userDataResponse.status === 200) {
            //console.log("Second POST request successful");
          } else {
            //console.log("Second POST request failed");
          }
        } catch (error) {
          //console.log(error);
        }
        setError("Please confirm your E-Mail!");
      }
    } catch (error) {
      //console.log(error);
      setError("Error!");
    }
  };

  return (
    <>
      <div className="flex lg:pt-[200px] justify-center items-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center">
          <Image
            className="mx-auto h-24 w-auto"
            src="/logos/logo-512.webp"
            alt="Headpat Logo"
            width={256}
            height={256}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white text-black">
            Register
          </h2>

          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}

          <form className="mt-10 space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 dark:text-white text-black"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 dark:text-white text-black shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 dark:text-white text-black"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 dark:text-white text-black shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 dark:text-white text-black"
                >
                  Password:
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 dark:text-white text-black shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div
              className="cf-turnstile"
              data-sitekey="0x4AAAAAAAKBrm1t6aDLrjRB"
            ></div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mb-6"
                onClick={handleSubmit}
              >
                Register your account
              </button>
              <div>
                <Link
                  href="/login"
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  &larr; Already have an account?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
