
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 pl-[70px] md:pl-[200px] overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-boovie-dark mb-4">Sobre o Boovie</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Conectando pessoas através do amor por filmes e livros desde 2024
              </p>
            </div>

            {/* Mission Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-boovie-orange">Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  O Boovie nasceu da paixão por entretenimento e da necessidade de conectar pessoas 
                  que compartilham o amor por filmes e livros. Nossa missão é criar uma plataforma 
                  onde você possa descobrir suas próximas obras favoritas através de recomendações 
                  inteligentes e da sabedoria coletiva de uma comunidade engajada.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <Target className="h-12 w-12 text-boovie-orange mb-4" />
                  <CardTitle>Precisão nas Recomendações</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Utilizamos algoritmos avançados e feedback da comunidade para oferecer 
                    recomendações cada vez mais precisas e personalizadas.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-boovie-teal mb-4" />
                  <CardTitle>Comunidade em Primeiro Lugar</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Acreditamos no poder da comunidade. Cada review, avaliação e recomendação 
                    contribui para tornar a experiência melhor para todos.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="h-12 w-12 text-boovie-orange mb-4" />
                  <CardTitle>Paixão pelo Entretenimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Somos movidos pela paixão por filmes e livros. Cada funcionalidade é 
                    pensada para celebrar e facilitar a descoberta de grandes obras.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-12 w-12 text-boovie-teal mb-4" />
                  <CardTitle>Inovação Constante</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Estamos sempre buscando novas formas de melhorar a experiência dos usuários 
                    através de tecnologia e inovação.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Story Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-boovie-teal">Nossa História</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-600">
                  <p>
                    O Boovie começou como um projeto pessoal de alguns entusiastas de cinema e 
                    literatura que estavam frustrados com a dificuldade de encontrar recomendações 
                    verdadeiramente relevantes em meio ao vasto oceano de conteúdo disponível hoje.
                  </p>
                  <p>
                    Percebemos que as melhores recomendações vinham de amigos e conhecidos que 
                    compartilhavam gostos similares. Assim nasceu a ideia de criar uma plataforma 
                    que combinasse a precisão de algoritmos inteligentes com o poder da comunidade.
                  </p>
                  <p>
                    Hoje, o Boovie conecta milhares de pessoas ao redor do mundo, ajudando-as a 
                    descobrir filmes emocionantes e livros transformadores. Cada usuário contribui 
                    para tornar as recomendações mais precisas e a comunidade mais rica.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Team Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-boovie-orange">Nossa Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Somos uma equipe apaixonada de desenvolvedores, designers e especialistas em 
                  entretenimento trabalhando para criar a melhor experiência de descoberta de 
                  conteúdo possível.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-boovie-orange rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="font-semibold text-boovie-dark">Desenvolvimento</h3>
                    <p className="text-sm text-gray-600">Criando tecnologia inovadora</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-boovie-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="font-semibold text-boovie-dark">Curadoria</h3>
                    <p className="text-sm text-gray-600">Garantindo qualidade do conteúdo</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-boovie-orange rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Zap className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="font-semibold text-boovie-dark">Comunidade</h3>
                    <p className="text-sm text-gray-600">Conectando pessoas e ideias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <div className="text-center bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-boovie-dark">Quer saber mais?</h2>
              <p className="text-gray-600 mb-6">
                Estamos sempre abertos a feedback, sugestões e parcerias.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-boovie-teal text-white rounded-lg hover:bg-boovie-teal/90 transition-colors"
              >
                Entre em Contato
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
