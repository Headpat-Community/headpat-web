export const createPatData = async (id) => {
  await fetch(`/api/fun/pats/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        users_permissions_user: id,
      },
    }),
  });
};
