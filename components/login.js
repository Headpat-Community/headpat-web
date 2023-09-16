import React, { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
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
      const response = await fetch(
        "https://backend.headpat.de/api/auth/local",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: email,
            password: password,
          }),
        }
      );
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
        const expirationTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `jwt=${
          data.jwt
        }; expires=${expirationTime.toUTCString()}; path=/; Secure`;
        //console.log("User authenticated successfully");
        window.location.href = "/account";
      }
    } catch (error) {
      //console.log(error);
      setError("E-Mail oder Passwort inkorrekt!");
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
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Login
          </h2>

          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}

          <form className="mt-10 space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
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
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Password:
                </label>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
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
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleSubmit}
              >
                Sign in
              </button>
            </div>
            <div>
              <Link
                href="/register"
                className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Make an account &rarr;
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
