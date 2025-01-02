import { getSession as getNextAuthSession } from "next-auth/react";

export async function getSession(req) {
  // Custom function to get session from main app
  try {
    const response = await fetch("http://localhost:3000/api/auth/session", {
      headers: {
        cookie: req.headers.cookie || "",
      },
      credentials: "include",
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export async function getServerSideProps({ req }) {
  const session = await getSession(req);

  if (!session) {
    return {
      redirect: {
        destination: "http://localhost:3000/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
