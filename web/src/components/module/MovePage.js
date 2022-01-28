import React from 'react';

const MovePage = (props) => {
  const { url, history } = props;

  history.push(url);
};

export default MovePage;