export const handler = async () => {
  const abc = 123;
  console.log(abc);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
