
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 pl-[70px] md:pl-[200px] overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-boovie-dark mb-4">Termos de Uso</h1>
              <p className="text-gray-600">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">1. Aceitação dos Termos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ao acessar e usar o Boovie, você concorda em cumprir e estar vinculado a estes 
                  Termos de Uso. Se você não concordar com qualquer parte destes termos, não 
                  deve usar nosso serviço.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">2. Descrição do Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  O Boovie é uma plataforma online que oferece:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Recomendações personalizadas de filmes e livros</li>
                  <li>Sistema de avaliação e reviews</li>
                  <li>Chat entre usuários</li>
                  <li>Feed de atividades da comunidade</li>
                  <li>Descoberta de conteúdo baseada em preferências</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">3. Cadastro e Conta do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">3.1 Elegibilidade</h4>
                  <p className="text-gray-600">
                    Você deve ter pelo menos 13 anos de idade para usar o Boovie. 
                    Se você tem entre 13 e 18 anos, deve ter permissão dos pais ou responsáveis.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">3.2 Informações da Conta</h4>
                  <p className="text-gray-600">
                    Você é responsável por manter a confidencialidade de sua conta e senha. 
                    Você concorda em aceitar responsabilidade por todas as atividades que 
                    ocorrem sob sua conta.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">3.3 Informações Precisas</h4>
                  <p className="text-gray-600">
                    Você concorda em fornecer informações verdadeiras, precisas e atualizadas 
                    durante o processo de registro e manter essas informações atualizadas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">4. Conduta do Usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ao usar o Boovie, você concorda em NÃO:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Postar conteúdo ofensivo, difamatório ou ilegal</li>
                  <li>Assediar ou intimidar outros usuários</li>
                  <li>Compartilhar conteúdo protegido por direitos autorais sem permissão</li>
                  <li>Usar o serviço para spam ou atividades comerciais não autorizadas</li>
                  <li>Tentar hackear ou comprometer a segurança da plataforma</li>
                  <li>Criar múltiplas contas para contornar restrições</li>
                  <li>Usar bots ou scripts automatizados</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">5. Conteúdo do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">5.1 Propriedade</h4>
                  <p className="text-gray-600">
                    Você mantém a propriedade do conteúdo que publica no Boovie, incluindo 
                    reviews, avaliações e mensagens.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">5.2 Licença</h4>
                  <p className="text-gray-600">
                    Ao postar conteúdo, você concede ao Boovie uma licença não exclusiva, 
                    mundial e isenta de royalties para usar, exibir e distribuir seu conteúdo 
                    em nossa plataforma.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">5.3 Moderação</h4>
                  <p className="text-gray-600">
                    Reservamos o direito de moderar, editar ou remover qualquer conteúdo 
                    que viole estes termos ou nossas diretrizes da comunidade.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">6. Propriedade Intelectual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  O Boovie e todo seu conteúdo original, recursos e funcionalidades são de 
                  propriedade exclusiva do Boovie e são protegidos por leis de direitos autorais, 
                  marcas registradas e outras leis de propriedade intelectual.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">7. Limitação de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  O Boovie é fornecido "como está" sem garantias de qualquer tipo. 
                  Não garantimos que o serviço será ininterrupto, seguro ou livre de erros. 
                  Em nenhum caso seremos responsáveis por danos indiretos, incidentais ou 
                  consequenciais decorrentes do uso de nosso serviço.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">8. Suspensão e Encerramento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reservamos o direito de suspender ou encerrar sua conta a qualquer momento, 
                  por qualquer motivo, incluindo violação destes termos. Você pode encerrar 
                  sua conta a qualquer momento entrando em contato conosco.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">9. Alterações nos Termos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Podemos modificar estes termos a qualquer momento. Notificaremos sobre 
                  alterações significativas através do site ou por e-mail. O uso continuado 
                  após as alterações constitui aceitação dos novos termos.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">10. Lei Aplicável</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Estes termos são regidos pelas leis do Brasil. Qualquer disputa será 
                  resolvida nos tribunais competentes de São Paulo, SP.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-boovie-orange">11. Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                </p>
                <div className="mt-4 space-y-2 text-gray-600">
                  <p><strong>E-mail:</strong> legal@boovie.com</p>
                  <p><strong>Endereço:</strong> São Paulo, SP, Brasil</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
