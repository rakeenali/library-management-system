const checkError = err => {
  if (err && err.response.data && err.response) {
    return {
      error: true,
      message: err.response.data.error
    };
  }
  return false;
};

export default checkError;
