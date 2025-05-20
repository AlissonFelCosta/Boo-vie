
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Index = () => {
  // Podemos adicionar melhorias de SEO aqui com Helmet
  return (
    <>
      <Helmet>
        <title>Boovie - Recomendações de filmes e livros</title>
        <meta name="description" content="Encontre as melhores recomendações de filmes, livros e jogos no Boovie." />
      </Helmet>
      <Navigate to="/" />
    </>
  );
};

export default Index;
