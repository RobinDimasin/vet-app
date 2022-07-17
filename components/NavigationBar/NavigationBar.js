import AccountContext from "@components/context/Account/AccountContext";
import styles from "@styles/NavigationBar.module.css";
import { makeName } from "utility";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";

const CATEGORY = {
  ACCOUNT: "ACCOUNT",
  NAVIGATION: "NAVIGATION",
  AUTHENTICATION: "AUTHENTICATION",
  DASHBOARD: "DASHBOARD",
};

export default function NavigationBar() {
  const { account, setAccount, logout } = useContext(AccountContext);

  const { topMenu, dropdownMenu } = useMemo(() => {
    const topMenu = {
      [CATEGORY.NAVIGATION]: {
        label: "Navigation",
        routes: [
          {
            key: "home",
            label: "Home",
            route: "/",
          },
          {
            key: "appointment",
            label: "Appointment",
            route: `/appointments?type=${
              account ? account.account_type : "owner"
            }`,
          },
          {
            key: "reviews",
            label: "Reviews",
            route: "/reviews",
          },
          {
            key: "faq",
            label: "FAQ",
            route: "/faq",
          },
          {
            key: "contact",
            label: "Contact Us",
            route: "/contact-us",
          },
        ],
      },
      [CATEGORY.AUTHENTICATION]: {
        label: "Authentication",
        routes: [
          {
            key: "register",
            label: "Register",
            route: "/register",
            visible: () => !account,
          },
          {
            key: "Login",
            label: "Login",
            route: "/login",
            visible: () => !account,
            render: ({ key, label, route }) => {
              return (
                <Link href={route} key={key}>
                  <a className="btn btn-primary">{label}</a>
                </Link>
              );
            },
          },
        ],
      },
    };

    for (const [key, category] of Object.entries(topMenu)) {
      category.routes = category.routes.filter(({ visible = true }) =>
        typeof visible === "function" ? visible() : visible
      );

      if (category.routes.length === 0) {
        delete topMenu[key];
      }
    }

    const dropdownMenu = {
      [CATEGORY.ACCOUNT]: {
        label: "Account",
        routes: [
          {
            key: "pets",
            label: "My Pets",
            route: "/pets",
            visible: () => account && account.account_type === "owner",
          },
          {
            key: "appointment",
            label: "My Appointments",
            route: "/appointments",
            visible: () => account && account.account_type === "owner",
          },
        ],
      },
      [CATEGORY.DASHBOARD]: {
        label: "Dashboard",
        routes: [
          {
            key: "account_dashboard",
            label: "Account Dashboard",
            route: "/accounts",
            visible: () => account && account.account_type === "admin",
          },
          {
            key: "pet_dashboard",
            label: "Pet Dashboard",
            route: "/pets?type=admin",
            visible: () => account && account.account_type === "admin",
          },
          {
            key: "appointment_dashboard",
            label: "Appointment Dashboard",
            route: "/appointments?type=admin",
            visible: () => account && account.account_type === "admin",
          },
          {
            key: "reason_dashboard",
            label: "Reason Dashboard",
            route: "/reasons",
            visible: () => account && account.account_type === "admin",
          },
          {
            key: "veterinarian_register",
            label: "Register Veterinarian",
            route: "/register?type=veterinarian",
            visible: () => account && account.account_type === "admin",
          },
          {
            key: "available_appointment",
            label: "Available Appointments",
            route: "/appointments?type=veterinarian",
            visible: () => account && account.account_type === "veterinarian",
          },
        ],
      },
      [CATEGORY.NAVIGATION]: {
        label: "Navigation",
        routes: [
          {
            key: "home",
            label: "Home",
            route: "/",
          },
          {
            key: "appointment",
            label: "Appointment",
            route: "/appointments",
          },
          {
            key: "reviews",
            label: "Reviews",
            route: "/reviews",
          },
          {
            key: "faq",
            label: "FAQ",
            route: "/faq",
          },
          {
            key: "contact",
            label: "Contact Us",
            route: "/contact-us",
          },
        ],
      },
      [CATEGORY.AUTHENTICATION]: {
        label: "Authentication",
        routes: [
          {
            key: "logout",
            label: "Logout",
            route: "/",
            dropdownOnly: true,
            visible: account,
            onClick: () => {
              logout();
            },
          },
          {
            key: "register",
            label: "Register",
            route: "/register",
            visible: !account,
          },
          {
            key: "Login",
            label: "Login",
            route: "/login",
            visible: !account,
            render: ({ key, label, route }) => {
              return (
                <Link href={route} key={key}>
                  <a className="btn btn-primary">{label}</a>
                </Link>
              );
            },
          },
        ],
      },
    };

    for (const [key, category] of Object.entries(dropdownMenu)) {
      category.routes = category.routes.filter(({ visible = true }) =>
        typeof visible === "function" ? visible() : visible
      );

      if (category.routes.length === 0) {
        delete dropdownMenu[key];
      }
    }

    return { topMenu, dropdownMenu };
  }, [account, logout]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      const navbar = document.querySelector(`.${styles.navbar}`);
      if (navbar) {
        setScrolled(window.scrollY !== 0);
      }
    };

    document.addEventListener("scroll", scrollListener);

    return () => {
      document.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div
      className={`navbar bg-transparent ${styles.navbar} md:px-[10%] duration-500 z-50`}
      data-scrolled={scrolled}
    >
      <div className="navbar-start space-x-1">
        <Link href="/">
          <a className="btn btn-ghost normal-case text-xl">
            <div className="w-10 rounded-full">
              <img src="/image/logo.png" />
            </div>
            Vetreatment
          </a>
        </Link>
        <ul className="menu menu-horizontal p-0 hidden lg:flex space-x-1">
          {topMenu[CATEGORY.NAVIGATION]
            ? topMenu[CATEGORY.NAVIGATION].routes
                .filter(({ dropdownOnly = false }) => !dropdownOnly)
                .map(
                  ({
                    key,
                    label,
                    route = "",
                    active = false,
                    onClick = () => {},
                  }) => {
                    return (
                      <li key={key}>
                        <Link href={route}>
                          <a
                            className={`btn ${
                              active ? "btn-outline shadow" : "btn-ghost"
                            }`}
                            onClick={onClick}
                          >
                            {label}
                          </a>
                        </Link>
                      </li>
                    );
                  }
                )
            : null}
        </ul>
      </div>

      <div className="navbar-end invisible md:visible space-x-1">
        {topMenu[CATEGORY.AUTHENTICATION]
          ? topMenu[CATEGORY.AUTHENTICATION].routes
              .filter(({ dropdownOnly = false }) => !dropdownOnly)
              .map(({ key, label, route = "", render, onClick = () => {} }) => {
                return render ? (
                  <div key={key}>{render({ key, label, route })}</div>
                ) : (
                  <Link href={route}>
                    <a
                      key={key}
                      className="btn btn-ghost"
                      href={route}
                      onClick={onClick}
                    >
                      {label}
                    </a>
                  </Link>
                );
              })
          : null}
        <div className="dropdown dropdown-end visible lg:invisble float-right">
          {account ? (
            <label tabIndex="0" className="btn btn-ghost">
              <div className="flex h-auto justify-center items-center">
                <div className="leading-none text-right space-y-1 pr-1">
                  <p className="text-sm leading-none">
                    {account.email ?? "test"}
                  </p>
                  <span className="badge badge-sm">
                    {account.account_type.toUpperCase()}
                  </span>
                </div>
                <div className="avatar justify-center">
                  <div className="avatar w-10 rounded-full relative">
                    {account && account.profile_picture_url ? (
                      <img
                        src={account.profile_picture_url}
                        layout="fill"
                        objectFit="cover"
                        alt={account ? makeName(account) : ""}
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </label>
          ) : (
            <label tabIndex="0" className="btn btn-ghost lg:hidden">
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          )}
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {Object.entries(dropdownMenu).map(([key, category], idx, arr) => {
              return (
                <>
                  {category.routes.map(
                    ({ key, label, route = "", onClick = () => {} }) => {
                      return (
                        <li key={key}>
                          <Link href={route}>
                            <a href={route} onClick={onClick}>
                              {label}
                            </a>
                          </Link>
                        </li>
                      );
                    }
                  )}
                  {idx !== arr.length - 1 ? (
                    <li className="menu-title">
                      <br />
                    </li>
                  ) : null}
                </>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
