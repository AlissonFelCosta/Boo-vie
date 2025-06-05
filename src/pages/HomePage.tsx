
import { Link } from "react-router-dom";
import { Film, BookOpen, MessageCircle, ListFilter, Star, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileNavigation />
      
      <div className="flex-1 pl-0 md:pl-[200px] overflow-y-auto">
        <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Bem-vindo ao <span className="text-boovie-orange">Boovie</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Descubra as melhores recomendações de filmes e livros personalizadas para você. 
              Conecte-se com outros apaixonados por entretenimento e compartilhe suas experiências.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-boovie-orange hover:bg-boovie-orange/90 text-white font-semibold">
                <Link to="/movies">
                  <Film className="mr-2 h-5 w-5" />
                  Explorar Filmes
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-400 text-gray-800 hover:bg-gray-50 font-semibold">
                <Link to="/books">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Descobrir Livros
                </Link>
              </Button>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Por que escolher o Boovie?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-gray-200">
                <CardHeader>
                  <Star className="h-12 w-12 text-boovie-orange mx-auto mb-4" />
                  <CardTitle className="text-gray-900">Recomendações Inteligentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700">
                    Algoritmos avançados que aprendem com suas preferências para sugerir 
                    filmes e livros perfeitos para seu gosto.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-gray-200">
                <CardHeader>
                  <Users className="h-12 w-12 text-boovie-teal mx-auto mb-4" />
                  <CardTitle className="text-gray-900">Comunidade Ativa</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700">
                    Conecte-se com outros usuários, compartilhe reviews e descubra 
                    novas perspectivas sobre seus filmes e livros favoritos.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-gray-200">
                <CardHeader>
                  <Zap className="h-12 w-12 text-boovie-orange mx-auto mb-4" />
                  <CardTitle className="text-gray-900">Experiência Personalizada</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700">
                    Interface intuitiva que se adapta às suas preferências, 
                    tornando a descoberta de conteúdo uma experiência única.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Navigation Cards */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Explore nossas funcionalidades
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/movies" className="group">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-gray-200 group-hover:border-boovie-orange">
                  <CardHeader className="text-center">
                    <Film className="h-16 w-16 text-boovie-orange mx-auto mb-4" />
                    <CardTitle className="text-gray-900">Filmes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700">
                      Explore milhares de filmes, desde clássicos até os últimos lançamentos. 
                      Encontre sua próxima obra-prima cinematográfica.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/books" className="group">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-gray-200 group-hover:border-boovie-teal">
                  <CardHeader className="text-center">
                    <BookOpen className="h-16 w-16 text-boovie-teal mx-auto mb-4" />
                    <CardTitle className="text-gray-900">Livros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700">
                      Descubra romances envolventes, não-ficção inspiradora e muito mais. 
                      Sua próxima leitura favorita está aqui.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/feed" className="group">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-gray-200 group-hover:border-boovie-orange">
                  <CardHeader className="text-center">
                    <ListFilter className="h-16 w-16 text-boovie-orange mx-auto mb-4" />
                    <CardTitle className="text-gray-900">Feed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700">
                      Acompanhe as atividades da comunidade, reviews recentes e 
                      recomendações dos outros usuários.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/chat" className="group">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-gray-200 group-hover:border-boovie-teal">
                  <CardHeader className="text-center">
                    <MessageCircle className="h-16 w-16 text-boovie-teal mx-auto mb-4" />
                    <CardTitle className="text-gray-900">Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700">
                      Converse com outros usuários, discuta suas obras favoritas e 
                      faça novas amizades literárias e cinematográficas.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-gray-50 rounded-lg p-8 mb-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
              Nossa missão
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-boovie-orange">Curadoria Inteligente</h3>
                <p className="text-gray-700">
                  Nossa plataforma utiliza algoritmos avançados de recomendação que analisam 
                  suas preferências, histórico de visualizações e avaliações para sugerir 
                  conteúdo verdadeiramente relevante para você.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-boovie-teal">Comunidade Engajada</h3>
                <p className="text-gray-700">
                  Faça parte de uma comunidade apaixonada por entretenimento. Compartilhe 
                  suas opiniões, descubra novos pontos de vista e conecte-se com pessoas 
                  que compartilham seus interesses.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já descobriram suas próximas 
              obras favoritas através do Boovie.
            </p>
            <Button asChild size="lg" className="bg-boovie-teal hover:bg-boovie-teal/90 text-white font-semibold">
              <Link to="/auth">
                Criar Conta Gratuita
              </Link>
            </Button>
          </section>
        </main>
      </div>
    </div>
  );
}
